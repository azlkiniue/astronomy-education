#!/usr/bin/env python3
# =============================================================================
#  tools/swf-inspect.py  —  DEV TOOL: read an original SWF's display list & art
#  -----------------------------------------------------------------------------
#  Companion to tools/swf-actions.py (which prints the ActionScript). This one
#  answers "where is it and what does it look like":
#
#    text    <file.swf>          every DefineEditText: variable, colour, initial text
#    place   <file.swf> [all]    PlaceObject records: depth, character id, instance
#                                name, matrix (sx, r0, r1, sy, tx, ty) — root only,
#                                or every sprite with "all"
#    shapes  <file.swf> <ids>    for sprite ids: their children + child bounds;
#                                for shape ids: bounds
#    fills   <file.swf> <ids>    DefineShape fill/line styles, including gradient
#                                matrices and every stop (ratio 0–255, colour, alpha)
#    edges   <file.swf> <ids>    DefineShape outlines as M/L/Q path commands, each run
#                                headed by the fill/line style it is drawn with
#    canvas  <file.swf> <ids>    the same shapes as a JS object a canvas can draw: each
#                                fill's region assembled into closed Path2D-ready paths,
#                                strokes as runs, gradients with their matrices
#
#  Matrices are in Flash's form: x' = sx·x + r1·y + tx,  y' = r0·x + sy·y + ty.
#  A linear/radial gradient spans ±819.2 px in its own space before its matrix,
#  so a stop at ratio k sits at (k/255 − 0.5)·1638.4 px along the gradient axis.
#
#  e.g.  python3 tools/swf-inspect.py place originals/.../buckets.swf all
#        python3 tools/swf-inspect.py fills originals/.../threeviewsspectra.swf 19,21,23
# =============================================================================
import zlib, struct, sys

def load(path):
    d = open(path, 'rb').read()
    body = zlib.decompress(d[8:]) if d[:3] == b'CWS' else d[8:]
    nbits = body[0] >> 3
    return d[3], body, (5 + 4 * nbits + 7) // 8 + 4

class Bits:
    def __init__(self, buf, pos): self.buf = buf; self.pos = pos * 8
    def ub(self, n):
        v = 0
        for _ in range(n):
            v = (v << 1) | ((self.buf[self.pos >> 3] >> (7 - (self.pos & 7))) & 1); self.pos += 1
        return v
    def sb(self, n):
        v = self.ub(n)
        return v - (1 << n) if n and v & (1 << (n - 1)) else v
    def align(self):
        if self.pos & 7: self.pos += 8 - (self.pos & 7)
    def byte(self): self.align(); return self.pos >> 3
    def u8(self): self.align(); v = self.buf[self.pos >> 3]; self.pos += 8; return v
    def u16(self):
        self.align(); v = struct.unpack('<H', self.buf[self.pos >> 3:(self.pos >> 3) + 2])[0]; self.pos += 16; return v

def rect(bits):
    n = bits.ub(5); v = [bits.sb(n) / 20 for _ in range(4)]; bits.align(); return v

def matrix(bits):
    sx = sy = 1.0; r0 = r1 = 0.0
    if bits.ub(1): n = bits.ub(5); sx = bits.sb(n) / 65536; sy = bits.sb(n) / 65536
    if bits.ub(1): n = bits.ub(5); r0 = bits.sb(n) / 65536; r1 = bits.sb(n) / 65536
    n = bits.ub(5); tx = bits.sb(n) / 20; ty = bits.sb(n) / 20
    bits.align()
    return (round(sx, 6), round(r0, 6), round(r1, 6), round(sy, 6), tx, ty)

def tags(body, off, end):
    while off < end:
        tc = struct.unpack('<H', body[off:off + 2])[0]; off += 2
        code, ln = tc >> 6, tc & 0x3f
        if ln == 0x3f: ln = struct.unpack('<I', body[off:off + 4])[0]; off += 4
        yield code, off, ln
        off += ln
        if code == 0: break

def cmd_text(path):
    _, b, off = load(path)
    def walk(o, end, depth):
        for code, p0, ln in tags(b, o, end):
            body = b[p0:p0 + ln]
            if code == 37:
                cid = struct.unpack('<H', body[:2])[0]
                bits = Bits(body, 2); rect(bits); p = bits.byte()
                f1, f2 = body[p], body[p + 1]; p += 2
                if f1 & 0x01: p += 4
                if f2 & 0x80: p = body.index(0, p) + 1
                color = None
                if f1 & 0x04: color = body[p:p + 4].hex(); p += 4
                if f1 & 0x02: p += 2
                if f2 & 0x20: p += 9
                j = body.index(0, p); var = body[p:j].decode('latin1'); p = j + 1
                txt = body[p:body.index(0, p)].decode('latin1') if f1 & 0x80 else ''
                print('  ' * depth + 'EditText id=%d var=%r color=%s html=%s text=%r' % (cid, var, color, bool(f2 & 2), txt[:300]))
            elif code == 39:
                walk(p0 + 4, p0 + ln, depth + 1)
    walk(off, len(b), 0)

def cmd_place(path, everything):
    _, b, off = load(path)
    def walk(o, end, where):
        for code, p0, ln in tags(b, o, end):
            body = b[p0:p0 + ln]
            if code in (26, 70):
                flags = body[0]; p = 2 if code == 70 else 1
                depth = struct.unpack('<H', body[p:p + 2])[0]; p += 2
                if code == 70 and body[1] & 0x08: p = body.index(0, p) + 1
                cid = None; mtx = None; name = None
                if flags & 0x02: cid = struct.unpack('<H', body[p:p + 2])[0]; p += 2
                if flags & 0x04: bits = Bits(body, p); mtx = matrix(bits); p = bits.byte()
                if flags & 0x08:
                    bits = Bits(body, p); add = bits.ub(1); mul = bits.ub(1); n = bits.ub(4)
                    if mul: [bits.sb(n) for _ in range(4)]
                    if add: [bits.sb(n) for _ in range(4)]
                    p = bits.byte()
                if flags & 0x10: p += 2
                if flags & 0x20: j = body.index(0, p); name = body[p:j].decode('latin1'); p = j + 1
                clip = struct.unpack('<H', body[p:p + 2])[0] if flags & 0x40 else None
                print('%s depth=%d id=%s name=%s mtx=%s%s' % (where, depth, cid, name, mtx,
                      ' clipDepth=%d' % clip if clip else ''))
            elif code == 39 and everything:
                walk(p0 + 4, p0 + ln, where + '/sprite%d' % struct.unpack('<H', body[:2])[0])
    walk(off, len(b), 'root')

def index(path):
    _, b, off = load(path)
    bounds, sprites = {}, {}
    def walk(o, end, sid):
        for code, p0, ln in tags(b, o, end):
            body = b[p0:p0 + ln]
            if code in (2, 22, 32, 83):
                bounds[struct.unpack('<H', body[:2])[0]] = ('shape', rect(Bits(body, 2)))
            elif code in (37, 11, 33):
                bounds[struct.unpack('<H', body[:2])[0]] = ('text', rect(Bits(body, 2)))
            elif code == 39:
                cid = struct.unpack('<H', body[:2])[0]; sprites[cid] = []; walk(p0 + 4, p0 + ln, cid)
            elif code in (26, 70) and sid is not None:
                flags = body[0]; p = 2 if code == 70 else 1
                depth = struct.unpack('<H', body[p:p + 2])[0]; p += 2
                if code == 70 and body[1] & 0x08: p = body.index(0, p) + 1
                cid = struct.unpack('<H', body[p:p + 2])[0] if flags & 0x02 else None
                sprites[sid].append((depth, cid))
    walk(off, len(b), None)
    return bounds, sprites

def cmd_shapes(path, ids):
    bounds, sprites = index(path)
    for i in ids:
        if i in sprites:
            print('sprite', i, [(dp, c, bounds.get(c)) for dp, c in sprites[i]])
        else:
            print('char', i, bounds.get(i))

def styles(bits, ver):
    cnt = bits.u8()
    if cnt == 0xff: cnt = bits.u16()
    fills = []
    for _ in range(cnt):
        t = bits.u8()
        rgba = lambda: [bits.u8() for _ in range(4)] if ver >= 3 else [bits.u8() for _ in range(3)] + [255]
        if t == 0:
            c = rgba(); fills.append(('solid', '#%02x%02x%02x' % tuple(c[:3]), c[3]))
        elif t in (0x10, 0x12, 0x13):
            m = matrix(bits); bits.align(); ng = bits.u8() & 0x0f; stops = []
            for _ in range(ng):
                r = bits.u8(); c = rgba(); stops.append((r, '#%02x%02x%02x' % tuple(c[:3]), c[3]))
            if t == 0x13: bits.u16()
            fills.append(('linear' if t == 0x10 else 'radial', m, stops))
        elif t in (0x40, 0x41, 0x42, 0x43):
            fills.append(('bitmap', bits.u16(), matrix(bits)))
    cnt = bits.u8()
    if cnt == 0xff: cnt = bits.u16()
    lines = []
    for _ in range(cnt):
        w = bits.u16()
        if ver == 4:                                 # LINESTYLE2: caps, join, maybe a fill
            cap = bits.ub(2); join = bits.ub(2); has_fill = bits.ub(1)
            bits.ub(3); bits.ub(5); bits.ub(1); bits.ub(2)
            if join == 2: bits.u16()                 # miter limit
            if has_fill:
                sub = styles_one_fill(bits, ver)
                lines.append((w / 20, sub, 255)); continue
        c = [bits.u8() for _ in range(4)] if ver >= 3 else [bits.u8() for _ in range(3)] + [255]
        lines.append((w / 20, '#%02x%02x%02x' % tuple(c[:3]), c[3]))
    return fills, lines

def styles_one_fill(bits, ver):
    """One FILLSTYLE on its own (a LINESTYLE2 may carry one instead of a colour)."""
    t = bits.u8()
    rgba = lambda: [bits.u8() for _ in range(4)] if ver >= 3 else [bits.u8() for _ in range(3)] + [255]
    if t == 0:
        c = rgba(); return ('solid', '#%02x%02x%02x' % tuple(c[:3]), c[3])
    if t in (0x10, 0x12, 0x13):
        m = matrix(bits); bits.align(); ng = bits.u8() & 0x0f; stops = []
        for _ in range(ng):
            r = bits.u8(); c = rgba(); stops.append((r, '#%02x%02x%02x' % tuple(c[:3]), c[3]))
        if t == 0x13: bits.u16()
        return ('linear' if t == 0x10 else 'radial', m, stops)
    return ('bitmap', bits.u16(), matrix(bits))

def cmd_fills(path, ids):
    _, b, off = load(path)
    want = set(ids)
    def walk(o, end):
        for code, p0, ln in tags(b, o, end):
            body = b[p0:p0 + ln]
            if code in (2, 22, 32, 83) and struct.unpack('<H', body[:2])[0] in want:
                ver = {2: 1, 22: 2, 32: 3, 83: 4}[code]
                bits = Bits(body, 2); bnd = rect(bits)
                if ver == 4: rect(bits); bits.u8()
                fills, lines = styles(bits, ver)
                print('shape', struct.unpack('<H', body[:2])[0], 'bounds', bnd)
                for k, f in enumerate(fills, 1): print('  fill', k, f)
                for k, l in enumerate(lines, 1): print('  line', k, l)
            elif code == 39:
                walk(p0 + 4, p0 + ln)
    walk(off, len(b))

def cmd_edges(path, ids):
    _, b, off = load(path)
    want = set(ids)
    def walk(o, end):
        for code, p0, ln in tags(b, o, end):
            body = b[p0:p0 + ln]
            if code in (2, 22, 32, 83) and struct.unpack('<H', body[:2])[0] in want:
                ver = {2: 1, 22: 2, 32: 3, 83: 4}[code]
                bits = Bits(body, 2); rect(bits)
                if ver == 4: rect(bits); bits.u8()
                fills, lines = styles(bits, ver)
                bits.align(); nf, nl = bits.ub(4), bits.ub(4)
                x = y = 0.0; f0 = f1 = ln_ = 0
                print('shape', struct.unpack('<H', body[:2])[0])
                def style():
                    pick = lambda arr, k: arr[k - 1] if k else None
                    return '  [fill0=%s fill1=%s line=%s]' % (pick(fills, f0), pick(fills, f1), pick(lines, ln_))
                while True:
                    if bits.ub(1) == 0:                     # style change / end
                        fl = bits.ub(5)
                        if fl == 0: break
                        if fl & 1:
                            n = bits.ub(5); x = bits.sb(n) / 20; y = bits.sb(n) / 20
                            print('M %.2f %.2f' % (x, y))
                        if fl & 2: f0 = bits.ub(nf)
                        if fl & 4: f1 = bits.ub(nf)
                        if fl & 8: ln_ = bits.ub(nl)
                        if fl & 16:                          # the indices now refer to a fresh set
                            fills, lines = styles(bits, ver)
                            bits.align(); nf, nl = bits.ub(4), bits.ub(4)
                        print(style())
                    elif bits.ub(1):                         # straight edge
                        n = bits.ub(4) + 2
                        if bits.ub(1): x += bits.sb(n) / 20; y += bits.sb(n) / 20
                        elif bits.ub(1): y += bits.sb(n) / 20
                        else: x += bits.sb(n) / 20
                        print('L %.2f %.2f' % (x, y))
                    else:                                    # quadratic curve
                        n = bits.ub(4) + 2
                        cx = x + bits.sb(n) / 20; cy = y + bits.sb(n) / 20
                        x = cx + bits.sb(n) / 20; y = cy + bits.sb(n) / 20
                        print('Q %.2f %.2f %.2f %.2f' % (cx, cy, x, y))
            elif code == 39:
                walk(p0 + 4, p0 + ln)
    walk(off, len(b))

def shape_layers(body, code):
    """A DefineShape's art as drawing layers, one per style set (NewStyles starts a
    new one, drawn over the last). Flash stores edges, not outlines: each edge
    names the fill on its left (fill0) and right (fill1). A fill's region is every
    edge that has it on either side — fill1 edges as they are, fill0 ones turned
    round — chained end to start into closed contours. Coordinates stay in twips
    while they are matched, so the chaining is exact."""
    ver = {2: 1, 22: 2, 32: 3, 83: 4}[code]
    bits = Bits(body, 2); rect(bits)
    winding = False
    if ver == 4: rect(bits); winding = bool(bits.u8() & 0x04)
    fills, lines = styles(bits, ver)
    bits.align(); nf, nl = bits.ub(4), bits.ub(4)
    layers = [(fills, lines, [])]
    x = y = 0; f0 = f1 = ln_ = 0
    while True:
        if bits.ub(1) == 0:
            fl = bits.ub(5)
            if fl == 0: break
            if fl & 1: n = bits.ub(5); x = bits.sb(n); y = bits.sb(n)
            n0 = bits.ub(nf) if fl & 2 else None
            n1 = bits.ub(nf) if fl & 4 else None
            nln = bits.ub(nl) if fl & 8 else None
            if fl & 16:                              # a fresh style set; this record's
                fills, lines = styles(bits, ver)     # indices already point into it
                bits.align(); nf, nl = bits.ub(4), bits.ub(4)
                layers.append((fills, lines, [])); f0 = f1 = ln_ = 0
            if n0 is not None: f0 = n0
            if n1 is not None: f1 = n1
            if nln is not None: ln_ = nln
        elif bits.ub(1):
            n = bits.ub(4) + 2
            if bits.ub(1): dx = bits.sb(n); dy = bits.sb(n)
            elif bits.ub(1): dx = 0; dy = bits.sb(n)
            else: dx = bits.sb(n); dy = 0
            layers[-1][2].append(((x, y), None, (x + dx, y + dy), f0, f1, ln_)); x += dx; y += dy
        else:
            n = bits.ub(4) + 2
            cx = x + bits.sb(n); cy = y + bits.sb(n); ex = cx + bits.sb(n); ey = cy + bits.sb(n)
            layers[-1][2].append(((x, y), (cx, cy), (ex, ey), f0, f1, ln_)); x, y = ex, ey
    out = []
    for fills, lines, edges in layers:
        lf = []
        for k in range(1, len(fills) + 1):
            mine = [(a, c, b) for a, c, b, g0, g1, _ in edges if g1 == k and g0 != k] + \
                   [(b, c, a) for a, c, b, g0, g1, _ in edges if g0 == k and g1 != k]
            if mine: lf.append((fills[k - 1], chain(mine)))
        ll = []
        for k in range(1, len(lines) + 1):
            mine = [(a, c, b) for a, c, b, _, _, g in edges if g == k]
            if mine: ll.append((lines[k - 1], runs(mine)))
        out.append((lf, ll))
    return out, winding

def px(v):
    s = ('%.2f' % (v / 20)).rstrip('0').rstrip('.')
    return '0' if s in ('', '-0') else s

def seg(c, b):
    return ('Q%s %s %s %s' % (px(c[0]), px(c[1]), px(b[0]), px(b[1]))) if c else \
           ('L%s %s' % (px(b[0]), px(b[1])))

def chain(edges):
    starts = {}
    for i, (a, _, _) in enumerate(edges): starts.setdefault(a, []).append(i)
    used = [False] * len(edges); d = []
    for i in range(len(edges)):
        if used[i]: continue
        used[i] = True; a, c, b = edges[i]; first = a
        d.append('M%s %s' % (px(a[0]), px(a[1]))); d.append(seg(c, b))
        while b != first:
            nxt = next((j for j in starts.get(b, ()) if not used[j]), None)
            if nxt is None: break
            used[nxt] = True; _, c, b = edges[nxt]; d.append(seg(c, b))
        d.append('Z')
    return ''.join(d)

def runs(edges):
    d = []; at = None
    for a, c, b in edges:
        if a != at: d.append('M%s %s' % (px(a[0]), px(a[1])))
        d.append(seg(c, b)); at = b
    return ''.join(d)

def js_colour(hexc, alpha):
    if alpha >= 255: return '"%s"' % hexc
    r, g, b = int(hexc[1:3], 16), int(hexc[3:5], 16), int(hexc[5:7], 16)
    return '"rgba(%d,%d,%d,%s)"' % (r, g, b, ('%.3f' % (alpha / 255)).rstrip('0').rstrip('.'))

def js_fill(f):
    if f[0] == 'solid': return js_colour(f[1], f[2])
    if f[0] in ('linear', 'radial'):
        sx, r0, r1, sy, tx, ty = f[1]
        stops = ','.join('[%s,%s]' % (('%.4f' % (r / 255)).rstrip('0').rstrip('.') or '0', js_colour(c, a))
                         for r, c, a in f[2])
        return '{t:"%s",m:[%s,%s,%s,%s,%s,%s],s:[%s]}' % (f[0][0], sx, r0, r1, sy, tx, ty, stops)
    return '"#808080"'                               # bitmap fills: not handled

def cmd_canvas(path, ids):
    """Print shapes as a JS object for a canvas renderer: per shape, its layers,
    each [[fill, pathData]...] then [[width, stroke, pathData]...]. Gradients come as
    {t:"l"|"r", m:[sx,r0,r1,sy,tx,ty], s:[[offset,colour]...]} in Flash's ±819.2 px
    gradient square; path data is SVG syntax, ready for new Path2D()."""
    _, b, off = load(path)
    want = set(ids); found = {}
    def walk(o, end):
        for code, p0, ln in tags(b, o, end):
            body = b[p0:p0 + ln]
            cid = struct.unpack('<H', body[:2])[0] if ln >= 2 else None
            if code in (2, 22, 32, 83) and cid in want: found[cid] = shape_layers(body, code)
            elif code == 39: walk(p0 + 4, p0 + ln)
    walk(off, len(b))
    print('{')
    for cid in ids:
        if cid not in found: continue
        layers, winding = found[cid]
        parts = []
        for lf, ll in layers:
            fs = ','.join('[%s,"%s"]' % (js_fill(f), d) for f, d in lf)
            ls = ','.join('[%s,%s,"%s"]' % (w, js_fill(s) if isinstance(s, tuple) else js_colour(s, a), d)
                          for (w, s, a), d in ll)
            parts.append('[[%s],[%s]]' % (fs, ls))
        print('  %d: {nz:%s, layers:[%s]},' % (cid, 'true' if winding else 'false', ','.join(parts)))
    print('}')

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(__doc__ or 'usage: swf-inspect.py text|place|shapes|fills|edges|canvas <file.swf> [...]'); sys.exit(1)
    cmd, path = sys.argv[1], sys.argv[2]
    ids = [int(x) for x in sys.argv[3].split(',')] if len(sys.argv) > 3 and sys.argv[3] != 'all' else []
    if cmd == 'text': cmd_text(path)
    elif cmd == 'place': cmd_place(path, len(sys.argv) > 3 and sys.argv[3] == 'all')
    elif cmd == 'shapes': cmd_shapes(path, ids)
    elif cmd == 'fills': cmd_fills(path, ids)
    elif cmd == 'edges': cmd_edges(path, ids)
    elif cmd == 'canvas': cmd_canvas(path, ids)
    else: print('unknown command', cmd); sys.exit(1)
