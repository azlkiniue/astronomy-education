#!/usr/bin/env python3
"""Disassemble the ActionScript 3 (AVM2 / DoABC) inside a SWF.

The companion to swf-actions.py, which only understands the AS1/AS2 bytecode in
DoAction tags. Flash CS3-and-later SWFs put all their code in DoABC instead, so
that tool prints nothing for them; this one walks the ABC constant pool, classes
and method bodies and prints a readable disassembly with every multiname, string
and number resolved.

    python3 tools/swf-abc.py <file.swf>                    # class/trait outline
    python3 tools/swf-abc.py <file.swf> -c MainTimeline    # one class, disassembled
    python3 tools/swf-abc.py <file.swf> -m updateSunAngle  # one method, anywhere
    python3 tools/swf-abc.py <file.swf> -c Globe -m draw   # both
    python3 tools/swf-abc.py <file.swf> --strings          # the string pool
    python3 tools/swf-abc.py <file.swf> --grep radius      # methods mentioning a word

Names are matched case-insensitively on a substring, so -c main finds
MainTimeline. Add -r/--raw to keep the bare stack ops; by default the printer
rebuilds expressions the way swf-actions.py does, which is far easier to read.
"""
import argparse
import io
import os
import re
import struct
import sys
import zlib


# ---------------------------------------------------------------- SWF container

def swf_body(path):
    data = open(path, 'rb').read()
    sig = data[:3]
    if sig == b'CWS':
        body = zlib.decompress(data[8:])
    elif sig == b'ZWS':
        import lzma
        body = lzma.decompress(data[12:] , format=lzma.FORMAT_ALONE)
    elif sig == b'FWS':
        body = data[8:]
    else:
        raise SystemExit('not a SWF: %s' % path)
    return body


def rect_len(body):
    nb = body[0] >> 3
    return (5 + nb * 4 + 7) // 8


def iter_tags(body):
    i = rect_len(body) + 4               # past the stage rect, frame rate, frame count
    n = len(body)
    while i + 2 <= n:
        th = struct.unpack('<H', body[i:i + 2])[0]
        i += 2
        code, ln = th >> 6, th & 0x3F
        if ln == 0x3F:
            ln = struct.unpack('<I', body[i:i + 4])[0]
            i += 4
        yield code, body[i:i + ln]
        i += ln
        if code == 0:
            break


def abc_blocks(body):
    """Every DoABC (82) and DoABCDefine (72) payload, past the name header."""
    out = []
    for code, payload in iter_tags(body):
        if code == 82:                   # u32 flags, then a null-terminated name
            j = payload.index(b'\0', 4)
            out.append((payload[4:j].decode('utf8', 'replace'), payload[j + 1:]))
        elif code == 72:
            out.append(('', payload))
    return out


# ------------------------------------------------------------------ ABC reading

class Reader:
    def __init__(self, buf):
        self.b, self.i = buf, 0

    def u8(self):
        v = self.b[self.i]
        self.i += 1
        return v

    def u30(self):
        v, shift = 0, 0
        while True:
            c = self.b[self.i]
            self.i += 1
            v |= (c & 0x7F) << shift
            if not c & 0x80 or shift >= 28:
                return v
            shift += 7

    u32 = u30

    def s32(self):
        v = self.u30()
        return v - (1 << 32) if v & 0x80000000 else v

    def s24(self):
        a, b, c = self.b[self.i], self.b[self.i + 1], self.b[self.i + 2]
        self.i += 3
        v = a | (b << 8) | (c << 16)
        return v - (1 << 24) if v & 0x800000 else v

    def d64(self):
        v = struct.unpack('<d', self.b[self.i:self.i + 8])[0]
        self.i += 8
        return v

    def utf(self):
        n = self.u30()
        s = self.b[self.i:self.i + n]
        self.i += n
        return s.decode('utf8', 'replace')


NS_KINDS = {0x08: '', 0x16: '', 0x17: '', 0x18: 'protected ', 0x19: 'explicit ',
            0x1A: 'static-protected ', 0x05: 'private '}


class ABC:
    def __init__(self, buf):
        r = Reader(buf)
        self.minor, self.major = r.u8() | (r.u8() << 8), r.u8() | (r.u8() << 8)

        self.ints = [0] + [r.s32() for _ in range(max(r.u30() - 1, 0))]
        self.uints = [0] + [r.u32() for _ in range(max(r.u30() - 1, 0))]
        self.doubles = [float('nan')] + [r.d64() for _ in range(max(r.u30() - 1, 0))]
        self.strings = [''] + [r.utf() for _ in range(max(r.u30() - 1, 0))]

        self.namespaces = [('', '')]
        for _ in range(max(r.u30() - 1, 0)):
            kind = r.u8()
            self.namespaces.append((NS_KINDS.get(kind, ''), self.strings[r.u30()]))

        self.ns_sets = [()]
        for _ in range(max(r.u30() - 1, 0)):
            self.ns_sets.append(tuple(r.u30() for _ in range(r.u30())))

        self.multinames = [None]
        for _ in range(max(r.u30() - 1, 0)):
            kind = r.u8()
            if kind in (0x07, 0x0D):                     # QName / QNameA
                self.multinames.append(('q', r.u30(), r.u30()))
            elif kind in (0x0F, 0x10):                   # RTQName
                self.multinames.append(('rtq', r.u30()))
            elif kind in (0x11, 0x12):                   # RTQNameL
                self.multinames.append(('rtql',))
            elif kind in (0x09, 0x0E):                   # Multiname
                self.multinames.append(('m', r.u30(), r.u30()))
            elif kind in (0x1B, 0x1C):                   # MultinameL
                self.multinames.append(('ml', r.u30()))
            elif kind == 0x1D:                           # TypeName (Vector.<T>)
                base = r.u30()
                self.multinames.append(('t', base, tuple(r.u30() for _ in range(r.u30()))))
            else:
                self.multinames.append(('?%02x' % kind,))

        self.methods = []
        for _ in range(r.u30()):
            pc = r.u30()
            ret = r.u30()
            params = [r.u30() for _ in range(pc)]
            name = self.strings[r.u30()]
            flags = r.u8()
            opts = []
            if flags & 0x08:
                opts = [(r.u30(), r.u8()) for _ in range(r.u30())]
            pnames = []
            if flags & 0x80:
                pnames = [self.strings[r.u30()] for _ in range(pc)]
            self.methods.append(dict(params=params, ret=ret, name=name, flags=flags,
                                     opts=opts, pnames=pnames, body=None))

        for _ in range(r.u30()):                         # metadata, skipped
            r.u30()
            for _ in range(r.u30()):
                r.u30(); r.u30()

        cc = r.u30()
        self.instances = []
        for _ in range(cc):
            name, sup, flags = r.u30(), r.u30(), r.u8()
            protected = r.u30() if flags & 0x08 else 0
            ifaces = [r.u30() for _ in range(r.u30())]
            iinit = r.u30()
            traits = self.read_traits(r)
            self.instances.append(dict(name=name, sup=sup, flags=flags, iinit=iinit,
                                       ifaces=ifaces, traits=traits, protected=protected))
        self.classes = []
        for _ in range(cc):
            self.classes.append(dict(cinit=r.u30(), traits=self.read_traits(r)))

        self.scripts = []
        for _ in range(r.u30()):
            self.scripts.append(dict(init=r.u30(), traits=self.read_traits(r)))

        for _ in range(r.u30()):
            mi = r.u30()
            body = dict(max_stack=r.u30(), local_count=r.u30(),
                        init_scope=r.u30(), max_scope=r.u30())
            n = r.u30()
            body['code'] = r.b[r.i:r.i + n]
            r.i += n
            body['excs'] = [dict(frm=r.u30(), to=r.u30(), target=r.u30(),
                                 type=r.u30(), var=r.u30()) for _ in range(r.u30())]
            body['traits'] = self.read_traits(r)
            self.methods[mi]['body'] = body

    def read_traits(self, r):
        out = []
        for _ in range(r.u30()):
            name = r.u30()
            kind = r.u8()
            k = kind & 0x0F
            t = dict(name=name, kind=k, attr=kind >> 4)
            if k in (0, 6):                              # slot / const
                t['slot'] = r.u30()
                t['type'] = r.u30()
                vi = r.u30()
                t['vindex'] = vi
                t['vkind'] = r.u8() if vi else 0
            elif k in (1, 2, 3):                         # method / getter / setter
                t['disp'] = r.u30()
                t['method'] = r.u30()
            elif k == 4:                                 # class
                t['slot'] = r.u30()
                t['classi'] = r.u30()
            elif k == 5:                                 # function
                t['slot'] = r.u30()
                t['method'] = r.u30()
            if kind >> 4 & 0x04:
                for _ in range(r.u30()):
                    r.u30()
            out.append(t)
        return out

    # -------------------------------------------------------------- name lookup

    def ns(self, i):
        pre, uri = self.namespaces[i]
        return uri

    def mn(self, i):
        """A multiname as source-like text."""
        if i == 0 or i >= len(self.multinames):
            return '*'
        m = self.multinames[i]
        if m is None:
            return '*'
        if m[0] == 'q':
            uri, nm = self.ns(m[1]), self.strings[m[2]]
            return '%s::%s' % (uri, nm) if uri else nm
        if m[0] == 'm':
            return self.strings[m[1]]
        if m[0] == 'ml':
            return '[]'
        if m[0] == 'rtq':
            return self.strings[m[1]]
        if m[0] == 'rtql':
            return '[rt]'
        if m[0] == 't':
            return '%s.<%s>' % (self.mn(m[1]), ','.join(self.mn(p) for p in m[2]))
        return '?'

    def short(self, i):
        """Just the local part, for matching and for pretty printing."""
        return self.mn(i).rsplit('::', 1)[-1].rsplit('.', 1)[-1]

    def const(self, index, kind):
        if kind in (0x01, 0x0B, 0x0C):                   # utf8 / true / false handled below
            pass
        if kind == 0x01:
            return repr(self.strings[index])
        if kind == 0x03:
            return str(self.ints[index])
        if kind == 0x04:
            return str(self.uints[index])
        if kind == 0x06:
            return fmtnum(self.doubles[index])
        if kind == 0x0A:
            return 'false'
        if kind == 0x0B:
            return 'true'
        if kind == 0x0C:
            return 'null'
        if kind == 0x00:
            return 'undefined'
        return '<k%02x:%d>' % (kind, index)


def fmtnum(v):
    if v != v:
        return 'NaN'
    if v == int(v) and abs(v) < 1e15:
        return str(int(v))
    return repr(v)


# ------------------------------------------------------------------- opcode set

# name, operand kinds. 'u' u30, 'b' u8, 's' s24 (branch), 'S' string, 'I' int,
# 'U' uint, 'D' double, 'M' multiname, 'N' namespace, 'C' class, 'F' method
OPS = {
    0x01: ('bkpt', ''), 0x02: ('nop', ''), 0x03: ('throw', ''),
    0x04: ('getsuper', 'M'), 0x05: ('setsuper', 'M'), 0x06: ('dxns', 'S'),
    0x07: ('dxnslate', ''), 0x08: ('kill', 'u'), 0x09: ('label', ''),
    0x0C: ('ifnlt', 's'), 0x0D: ('ifnle', 's'), 0x0E: ('ifngt', 's'),
    0x0F: ('ifnge', 's'), 0x10: ('jump', 's'), 0x11: ('iftrue', 's'),
    0x12: ('iffalse', 's'), 0x13: ('ifeq', 's'), 0x14: ('ifne', 's'),
    0x15: ('iflt', 's'), 0x16: ('ifle', 's'), 0x17: ('ifgt', 's'),
    0x18: ('ifge', 's'), 0x19: ('ifstricteq', 's'), 0x1A: ('ifstrictne', 's'),
    0x1B: ('lookupswitch', 'L'), 0x1C: ('pushwith', ''), 0x1D: ('popscope', ''),
    0x1E: ('nextname', ''), 0x1F: ('hasnext', ''), 0x20: ('pushnull', ''),
    0x21: ('pushundefined', ''), 0x23: ('nextvalue', ''), 0x24: ('pushbyte', 'B'),
    0x25: ('pushshort', 'u'), 0x26: ('pushtrue', ''), 0x27: ('pushfalse', ''),
    0x28: ('pushnan', ''), 0x29: ('pop', ''), 0x2A: ('dup', ''), 0x2B: ('swap', ''),
    0x2C: ('pushstring', 'S'), 0x2D: ('pushint', 'I'), 0x2E: ('pushuint', 'U'),
    0x2F: ('pushdouble', 'D'), 0x30: ('pushscope', ''), 0x31: ('pushnamespace', 'N'),
    0x32: ('hasnext2', 'uu'), 0x40: ('newfunction', 'F'), 0x41: ('call', 'u'),
    0x42: ('construct', 'u'), 0x43: ('callmethod', 'uu'), 0x44: ('callstatic', 'uu'),
    0x45: ('callsuper', 'Mu'), 0x46: ('callproperty', 'Mu'), 0x47: ('returnvoid', ''),
    0x48: ('returnvalue', ''), 0x49: ('constructsuper', 'u'),
    0x4A: ('constructprop', 'Mu'), 0x4C: ('callproplex', 'Mu'),
    0x4E: ('callsupervoid', 'Mu'), 0x4F: ('callpropvoid', 'Mu'),
    0x53: ('applytype', 'u'), 0x55: ('newobject', 'u'), 0x56: ('newarray', 'u'),
    0x57: ('newactivation', ''), 0x58: ('newclass', 'C'), 0x59: ('getdescendants', 'M'),
    0x5A: ('newcatch', 'u'), 0x5D: ('findpropstrict', 'M'), 0x5E: ('findproperty', 'M'),
    0x5F: ('finddef', 'M'), 0x60: ('getlex', 'M'), 0x61: ('setproperty', 'M'),
    0x62: ('getlocal', 'u'), 0x63: ('setlocal', 'u'), 0x64: ('getglobalscope', ''),
    0x65: ('getscopeobject', 'B'), 0x66: ('getproperty', 'M'), 0x68: ('initproperty', 'M'),
    0x6A: ('deleteproperty', 'M'), 0x6C: ('getslot', 'u'), 0x6D: ('setslot', 'u'),
    0x6E: ('getglobalslot', 'u'), 0x6F: ('setglobalslot', 'u'),
    0x70: ('convert_s', ''), 0x71: ('esc_xelem', ''), 0x72: ('esc_xattr', ''),
    0x73: ('convert_i', ''), 0x74: ('convert_u', ''), 0x75: ('convert_d', ''),
    0x76: ('convert_b', ''), 0x77: ('convert_o', ''), 0x78: ('checkfilter', ''),
    0x80: ('coerce', 'M'), 0x82: ('coerce_a', ''), 0x85: ('coerce_s', ''),
    0x86: ('astype', 'M'), 0x87: ('astypelate', ''), 0x90: ('negate', ''),
    0x91: ('increment', ''), 0x92: ('inclocal', 'u'), 0x93: ('decrement', ''),
    0x94: ('declocal', 'u'), 0x95: ('typeof', ''), 0x96: ('not', ''),
    0x97: ('bitnot', ''), 0xA0: ('add', ''), 0xA1: ('subtract', ''),
    0xA2: ('multiply', ''), 0xA3: ('divide', ''), 0xA4: ('modulo', ''),
    0xA5: ('lshift', ''), 0xA6: ('rshift', ''), 0xA7: ('urshift', ''),
    0xA8: ('bitand', ''), 0xA9: ('bitor', ''), 0xAA: ('bitxor', ''),
    0xAB: ('equals', ''), 0xAC: ('strictequals', ''), 0xAD: ('lessthan', ''),
    0xAE: ('lessequals', ''), 0xAF: ('greaterthan', ''), 0xB0: ('greaterequals', ''),
    0xB1: ('instanceof', ''), 0xB2: ('istype', 'M'), 0xB3: ('istypelate', ''),
    0xB4: ('in', ''), 0xC0: ('increment_i', ''), 0xC1: ('decrement_i', ''),
    0xC2: ('inclocal_i', 'u'), 0xC3: ('declocal_i', 'u'), 0xC4: ('negate_i', ''),
    0xC5: ('add_i', ''), 0xC6: ('subtract_i', ''), 0xC7: ('multiply_i', ''),
    0xD0: ('getlocal_0', ''), 0xD1: ('getlocal_1', ''), 0xD2: ('getlocal_2', ''),
    0xD3: ('getlocal_3', ''), 0xD4: ('setlocal_0', ''), 0xD5: ('setlocal_1', ''),
    0xD6: ('setlocal_2', ''), 0xD7: ('setlocal_3', ''),
    0xEF: ('debug', 'buBu'), 0xF0: ('debugline', 'u'), 0xF1: ('debugfile', 'S'),
    0xF2: ('bkptline', 'u'), 0xF3: ('timestamp', ''),
}

BIN = {'add': '+', 'subtract': '-', 'multiply': '*', 'divide': '/', 'modulo': '%',
       'lshift': '<<', 'rshift': '>>', 'urshift': '>>>', 'bitand': '&', 'bitor': '|',
       'bitxor': '^', 'equals': '==', 'strictequals': '===', 'lessthan': '<',
       'lessequals': '<=', 'greaterthan': '>', 'greaterequals': '>=',
       'add_i': '+', 'subtract_i': '-', 'multiply_i': '*', 'instanceof': 'instanceof',
       'in': 'in', 'istypelate': 'is', 'astypelate': 'as'}

BRANCH = {'ifnlt': '!<', 'ifnle': '!<=', 'ifngt': '!>', 'ifnge': '!>=',
          'ifeq': '==', 'ifne': '!=', 'iflt': '<', 'ifle': '<=', 'ifgt': '>',
          'ifge': '>=', 'ifstricteq': '===', 'ifstrictne': '!=='}


def decode(abc, code):
    """[(offset, name, [operands])], operands already resolved to text."""
    r = Reader(code)
    out = []
    n = len(code)
    while r.i < n:
        off = r.i
        op = r.u8()
        name, kinds = OPS.get(op, ('op%02x' % op, ''))
        args = []
        if kinds == 'L':                                  # lookupswitch
            default = off + r.s24()
            cnt = r.u30()
            cases = [off + r.s24() for _ in range(cnt + 1)]
            args = [default, cases]
        else:
            for k in kinds:
                if k == 'u':
                    args.append(r.u30())
                elif k == 'B':
                    args.append(r.u8())
                elif k == 'b':
                    args.append(r.u8())
                elif k == 's':
                    args.append(r.i + 3 + r.s24() - 3 + 0)  # placeholder, fixed below
                elif k == 'S':
                    args.append(abc.strings[r.u30()])
                elif k == 'I':
                    args.append(abc.ints[r.u30()])
                elif k == 'U':
                    args.append(abc.uints[r.u30()])
                elif k == 'D':
                    args.append(abc.doubles[r.u30()])
                elif k == 'M':
                    args.append(abc.mn(r.u30()))
                elif k == 'N':
                    args.append(abc.ns(r.u30()))
                elif k == 'C':
                    args.append(r.u30())
                elif k == 'F':
                    args.append(r.u30())
        out.append([off, name, args, r.i])
    # branch targets: recompute properly (s24 is relative to the END of the op)
    r = Reader(code)
    idx = 0
    while r.i < n:
        off = r.i
        op = r.u8()
        name, kinds = OPS.get(op, ('op%02x' % op, ''))
        if kinds == 'L':
            base = r.i
            d = r.s24()
            cnt = r.u30()
            cases = [off + r.s24() for _ in range(cnt + 1)]
            out[idx][2] = [off + d, cases]
        else:
            for k in kinds:
                if k == 's':
                    d = r.s24()
                    out[idx][2] = [r.i + d]
                elif k in 'uICDF':
                    r.u30()
                elif k in 'Bb':
                    r.u8()
                elif k in 'SMN':
                    r.u30()
                elif k == 'U':
                    r.u30()
        idx += 1
    return out


# --------------------------------------------------------------- pretty printer

def quote(s):
    return '"%s"' % s.replace('\\', '\\\\').replace('"', '\\"')


def render(abc, m, indent='    '):
    """Rebuild expressions off the operand stack, the way swf-actions.py does."""
    body = m['body']
    ops = decode(abc, body['code'])
    targets = set()
    for _, name, args, _e in ops:
        if name in BRANCH or name in ('jump', 'iftrue', 'iffalse'):
            targets.add(args[0])
        elif name == 'lookupswitch':
            targets.add(args[0])
            targets.update(args[1])

    names = {}
    pn = m['pnames'] or ['a%d' % (i + 1) for i in range(len(m['params']))]
    names[0] = 'this'
    for i, p in enumerate(pn):
        names[i + 1] = p
    def loc(i):
        return names.get(i, 'L%d' % i)

    lines, st = [], []

    def pop(k=1):
        out = []
        for _ in range(k):
            out.append(st.pop() if st else '?')
        out.reverse()
        return out

    def emit(off, text):
        lines.append('%s%5d: %s' % (indent, off, text))

    for off, name, args, _e in ops:
        if off in targets:
            lines.append('%s%5d: :label' % (indent, off))
        if name.startswith('getlocal_'):
            st.append(loc(int(name[-1])))
        elif name == 'getlocal':
            st.append(loc(args[0]))
        elif name.startswith('setlocal_') or name == 'setlocal':
            i = int(name[-1]) if name.startswith('setlocal_') else args[0]
            emit(off, '%s = %s;' % (loc(i), pop()[0]))
        elif name == 'pushbyte' or name == 'pushshort':
            st.append(str(args[0] if args[0] < 128 or name == 'pushshort' else args[0] - 256))
        elif name in ('pushint', 'pushuint'):
            st.append(str(args[0]))
        elif name == 'pushdouble':
            st.append(fmtnum(args[0]))
        elif name == 'pushstring':
            st.append(quote(args[0]))
        elif name == 'pushtrue':
            st.append('true')
        elif name == 'pushfalse':
            st.append('false')
        elif name == 'pushnull':
            st.append('null')
        elif name == 'pushundefined':
            st.append('undefined')
        elif name == 'pushnan':
            st.append('NaN')
        elif name in ('getlex', 'findpropstrict', 'findproperty', 'finddef'):
            st.append(args[0].rsplit('::', 1)[-1])
        elif name == 'getproperty':
            o = pop()[0]
            st.append('%s[%s]' % (o, pop()[0]) if args[0] == '[]' else
                      '%s.%s' % (o, args[0].rsplit('::', 1)[-1]))
        elif name == 'getsuper':
            pop()
            st.append('super.%s' % args[0].rsplit('::', 1)[-1])
        elif name in ('setproperty', 'initproperty'):
            v = pop()[0]
            if args[0] == '[]':
                k = pop()[0]
                emit(off, '%s[%s] = %s;' % (pop()[0], k, v))
            else:
                emit(off, '%s.%s = %s;' % (pop()[0], args[0].rsplit('::', 1)[-1], v))
        elif name == 'setsuper':
            v = pop()[0]
            emit(off, 'super.%s = %s;  // on %s' % (args[0].rsplit('::', 1)[-1], v, pop()[0]))
        elif name in ('callproperty', 'callproplex', 'callpropvoid'):
            a = pop(args[1])
            o = pop()[0]
            call = '%s.%s(%s)' % (o, args[0].rsplit('::', 1)[-1], ', '.join(a))
            if name == 'callpropvoid':
                emit(off, call + ';')
            else:
                st.append(call)
        elif name in ('callsuper', 'callsupervoid'):
            a = pop(args[1])
            o = pop()[0]
            call = 'super.%s(%s)' % (args[0].rsplit('::', 1)[-1], ', '.join(a))
            if name == 'callsupervoid':
                emit(off, call + ';')
            else:
                st.append(call)
        elif name == 'call':
            a = pop(args[0])
            pop()                                      # receiver
            st.append('%s(%s)' % (pop()[0], ', '.join(a)))
        elif name == 'construct':
            a = pop(args[0])
            st.append('new %s(%s)' % (pop()[0], ', '.join(a)))
        elif name == 'constructprop':
            a = pop(args[1])
            st.append('new %s.%s(%s)' % (pop()[0], args[0].rsplit('::', 1)[-1], ', '.join(a)))
        elif name == 'constructsuper':
            a = pop(args[0])
            emit(off, 'super(%s);  // on %s' % (', '.join(a), pop()[0]))
        elif name == 'newarray':
            st.append('[%s]' % ', '.join(pop(args[0])))
        elif name == 'newobject':
            kv = pop(args[0] * 2)
            st.append('{%s}' % ', '.join('%s: %s' % (kv[i], kv[i + 1])
                                         for i in range(0, len(kv), 2)))
        elif name == 'newfunction':
            st.append('function#%d' % args[0])
        elif name == 'newclass':
            pop()
            st.append('class#%d' % args[0])
        elif name in BIN:
            b, a = pop()[0], pop()[0]
            st.append('(%s %s %s)' % (a, BIN[name], b))
        elif name == 'negate' or name == 'negate_i':
            st.append('-%s' % pop()[0])
        elif name == 'not':
            st.append('!%s' % pop()[0])
        elif name == 'bitnot':
            st.append('~%s' % pop()[0])
        elif name == 'typeof':
            st.append('typeof %s' % pop()[0])
        elif name in ('increment', 'increment_i'):
            st.append('(%s + 1)' % pop()[0])
        elif name in ('decrement', 'decrement_i'):
            st.append('(%s - 1)' % pop()[0])
        elif name in ('inclocal', 'inclocal_i'):
            emit(off, '%s++;' % loc(args[0]))
        elif name in ('declocal', 'declocal_i'):
            emit(off, '%s--;' % loc(args[0]))
        elif name == 'dup':
            v = st[-1] if st else '?'
            st.append(v)
        elif name == 'swap':
            if len(st) >= 2:
                st[-1], st[-2] = st[-2], st[-1]
        elif name == 'pop':
            v = pop()[0]
            if '(' in v:
                emit(off, v + ';')
        elif name in ('coerce', 'astype'):
            st.append('%s as %s' % (pop()[0], args[0].rsplit('::', 1)[-1]))
        elif name == 'istype':
            st.append('(%s is %s)' % (pop()[0], args[0].rsplit('::', 1)[-1]))
        elif name in ('coerce_a', 'coerce_s', 'convert_s', 'convert_i', 'convert_u',
                      'convert_d', 'convert_b', 'convert_o', 'checkfilter', 'label',
                      'nop', 'debug', 'debugline', 'debugfile', 'bkptline'):
            pass
        elif name in ('pushscope', 'pushwith'):
            pop()
        elif name in ('popscope', 'getglobalscope', 'getscopeobject', 'newactivation'):
            if name in ('getglobalscope', 'getscopeobject', 'newactivation'):
                st.append('scope')
        elif name == 'returnvalue':
            emit(off, 'return %s;' % pop()[0])
        elif name == 'returnvoid':
            emit(off, 'return;')
        elif name == 'throw':
            emit(off, 'throw %s;' % pop()[0])
        elif name == 'jump':
            emit(off, 'goto %d;' % args[0])
        elif name in ('iftrue', 'iffalse'):
            emit(off, 'if (%s%s) goto %d;' % ('!' if name == 'iffalse' else '',
                                              pop()[0], args[0]))
        elif name in BRANCH:
            b, a = pop()[0], pop()[0]
            emit(off, 'if (%s %s %s) goto %d;' % (a, BRANCH[name], b, args[0]))
        elif name == 'lookupswitch':
            emit(off, 'switch (%s) default %d, cases %s;'
                 % (pop()[0], args[0], args[1]))
        elif name == 'deleteproperty':
            emit(off, 'delete %s.%s;' % (pop()[0], args[0].rsplit('::', 1)[-1]))
        elif name == 'getslot':
            st.append('%s.slot%d' % (pop()[0], args[0]))
        elif name == 'setslot':
            v = pop()[0]
            emit(off, '%s.slot%d = %s;' % (pop()[0], args[0], v))
        elif name in ('hasnext2', 'nextname', 'nextvalue', 'hasnext'):
            emit(off, '// %s %s' % (name, args))
            st.append(name)
        elif name == 'kill':
            pass
        else:
            emit(off, '// %s %s   [stack %s]' % (name, args, st[-3:]))
    return lines


def raw(abc, m, indent='    '):
    out = []
    for off, name, args, _e in decode(abc, m['body']['code']):
        txt = ' '.join(quote(a) if isinstance(a, str) and name == 'pushstring'
                       else str(a) for a in args)
        out.append('%s%5d: %-16s %s' % (indent, off, name, txt))
    return out


# ------------------------------------------------------------------ the printer

def sig(abc, m, nm):
    ps = ', '.join('%s:%s' % (m['pnames'][i] if m['pnames'] else 'a%d' % (i + 1),
                              abc.short(p)) for i, p in enumerate(m['params']))
    return '%s(%s):%s' % (nm, ps, abc.short(m['ret']))


KINDS = {0: 'var', 1: 'function', 2: 'get', 3: 'set', 4: 'class', 5: 'function', 6: 'const'}


def dump(abc, args):
    want_c = args.cls.lower() if args.cls else None
    want_m = args.method.lower() if args.method else None
    words = [w.lower() for w in args.words]

    def hit(text):
        return not words or any(w in text.lower() for w in words)

    for ci, inst in enumerate(abc.instances):
        cname = abc.short(inst['name'])
        if want_c and want_c not in cname.lower():
            continue
        head = 'class %s extends %s' % (cname, abc.short(inst['sup']))
        shown = False
        members = []
        for t in inst['traits'] + abc.classes[ci]['traits']:
            k = KINDS.get(t['kind'], '?')
            tn = abc.short(t['name'])
            if t['kind'] in (0, 6):
                members.append(('  %s %s:%s%s' % (k, tn, abc.short(t['type']),
                                ' = ' + abc.const(t['vindex'], t['vkind'])
                                if t.get('vindex') else ''), None, tn))
            elif t['kind'] in (1, 2, 3, 5):
                m = abc.methods[t['method']]
                members.append(('  %s %s' % (k, sig(abc, m, tn)), m, tn))
        specials = [('  constructor', abc.methods[inst['iinit']], cname),
                    ('  static init', abc.methods[abc.classes[ci]['cinit']], cname)]
        for label, m, tn in specials + members:
            if want_m and want_m not in tn.lower():
                continue
            text = label
            if m is not None and m['body'] is not None and (args.cls or args.method or words):
                lines = raw(abc, m) if args.raw else render(abc, m)
                text = label + '\n' + '\n'.join(lines)
            if not hit(text):
                continue
            if not shown:
                print('\n' + '=' * 72 + '\n' + head)
                shown = True
            print(text)

    if want_c or want_m or words:
        return
    print('\n--- scripts ---')
    for s in abc.scripts:
        for t in s['traits']:
            print('  %s %s' % (KINDS.get(t['kind'], '?'), abc.short(t['name'])))


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('swf')
    ap.add_argument('words', nargs='*', help='only print members mentioning these')
    ap.add_argument('-c', '--class', dest='cls', help='class name substring')
    ap.add_argument('-m', '--method', help='method/property name substring')
    ap.add_argument('-r', '--raw', action='store_true', help='bare stack opcodes')
    ap.add_argument('--strings', action='store_true', help='print the string pool')
    ap.add_argument('--grep', help='alias for a single positional word')
    a = ap.parse_args()
    if a.grep:
        a.words.append(a.grep)

    body = swf_body(a.swf)
    blocks = abc_blocks(body)
    if not blocks:
        raise SystemExit('no DoABC tag — this is an AS1/AS2 SWF, use tools/swf-actions.py')
    for name, buf in blocks:
        abc = ABC(buf)
        if a.strings:
            for i, s in enumerate(abc.strings):
                if s.strip():
                    print('%5d %s' % (i, s))
            continue
        dump(abc, a)


if __name__ == '__main__':
    main()
