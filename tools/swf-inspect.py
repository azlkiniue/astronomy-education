#!/usr/bin/env python3
# =============================================================================
#  tools/swf-inspect.py  —  DEV TOOL: read an original SWF's display list & art
#  -----------------------------------------------------------------------------
#  Companion to tools/swf-actions.py (which prints the ActionScript). This one
#  answers "where is it and what does it look like":
#
#    text    <file.swf>          every DefineEditText: variable, colour, initial text
#    place   <file.swf> [all]    PlaceObject records: depth, character id, instance
#                                name, matrix (sx, r0, r1, sy, tx, ty), clipDepth and
#                                colour transform (mul/256, add) — root only, or every
#                                sprite with "all"
#    shapes  <file.swf> <ids>    for sprite ids: their children + child bounds;
#                                for shape ids: bounds
#    fills   <file.swf> <ids>    DefineShape fill/line styles, including gradient
#                                matrices and every stop (ratio 0–255, colour, alpha)
#    edges   <file.swf> <ids>    DefineShape outlines as M/L/Q path commands, each run
#                                headed by the fill/line style it is drawn with
#    canvas  <file.swf> <ids>    the same shapes as a JS object a canvas can draw: each
#                                fill's region assembled into closed Path2D-ready paths,
#                                strokes as runs, gradients with their matrices
#    statictext <file.swf> [ids] glyph-drawn DefineText labels decoded back into
#                                strings through each font's code table: matrix, and per
#                                run its font (name, bold/italic), size, colour, x, y
#    morph   <file.swf> <ids>    DefineMorphShapes as a JS object a canvas can tween: the
#                                fills' regions and the strokes' runs as paths whose every
#                                point carries its start AND end position, styles with
#                                their start and end colours / gradients / widths
#    bitmaps <file.swf> [outdir] every embedded bitmap: id, tag, size; with an outdir,
#                                each is written out as <id>.jpg / <id>.png (JPEGTables
#                                merged, the bogus FFD9FFD8 prefix stripped, lossless
#                                formats 3/4/5 un-premultiplied into RGBA PNGs, JPEG3
#                                alpha merged via ffmpeg into a PNG)
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
                font = size = None
                if f1 & 0x01: font = struct.unpack('<H', body[p:p + 2])[0]; p += 2
                if f2 & 0x80: p = body.index(0, p) + 1
                if f1 & 0x01: size = struct.unpack('<H', body[p:p + 2])[0] / 20; p += 2
                color = None
                if f1 & 0x04: color = body[p:p + 4].hex(); p += 4
                if f1 & 0x02: p += 2
                align = None
                if f2 & 0x20: align = ['left', 'right', 'center', 'justify'][body[p] & 3]; p += 9
                j = body.index(0, p); var = body[p:j].decode('latin1'); p = j + 1
                txt = body[p:body.index(0, p)].decode('latin1') if f1 & 0x80 else ''
                print('  ' * depth + 'EditText id=%d var=%r font=%s size=%s align=%s color=%s html=%s text=%r' % (
                    cid, var, font, size, align, color, bool(f2 & 2), txt[:300]))
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
                cx = ''
                if flags & 0x08:                         # colour transform: mul/256 and add, RGBA
                    bits = Bits(body, p); add = bits.ub(1); mul = bits.ub(1); n = bits.ub(4)
                    mv = [bits.sb(n) for _ in range(4)] if mul else None
                    av = [bits.sb(n) for _ in range(4)] if add else None
                    p = bits.byte()
                    cx = ' cxform mul=%s add=%s' % (mv, av)
                if flags & 0x10: p += 2
                if flags & 0x20: j = body.index(0, p); name = body[p:j].decode('latin1'); p = j + 1
                clip = struct.unpack('<H', body[p:p + 2])[0] if flags & 0x40 else None
                print('%s depth=%d id=%s name=%s mtx=%s%s%s' % (where, depth, cid, name, mtx,
                      ' clipDepth=%d' % clip if clip else '', cx))
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

def morph_shape(body):
    """A DefineMorphShape (tag 46) as start/end pairs. Flash tweens it edge by edge:
    the end shape holds the same edges in the same order (moveTos only, no styles),
    a straight edge facing a curve becomes a curve with its control at the middle.
    Returns the fill and line styles (start and end) and the edges, each point a
    (start, end) pair of twip coordinates, with the start's fill0/fill1/line."""
    bits = Bits(body, 2); rect(bits); rect(bits)
    bits.u16(); bits.u16()                                  # offset to EndEdges (UI32)
    cnt = bits.u8()
    if cnt == 0xff: cnt = bits.u16()
    fills = []
    rgba = lambda: [bits.u8() for _ in range(4)]
    for _ in range(cnt):
        t = bits.u8()
        if t == 0:
            fills.append(('solid', rgba(), rgba()))
        elif t in (0x10, 0x12):
            m0 = matrix(bits); m1 = matrix(bits); bits.align()
            ng = bits.u8() & 0x0f; stops = []
            for _ in range(ng):
                r0 = bits.u8(); c0 = rgba(); r1 = bits.u8(); c1 = rgba(); stops.append((r0, c0, r1, c1))
            fills.append(('linear' if t == 0x10 else 'radial', m0, m1, stops))
        else:
            bits.u16(); matrix(bits); matrix(bits); fills.append(('bitmap',))
    cnt = bits.u8()
    if cnt == 0xff: cnt = bits.u16()
    lines = [(bits.u16() / 20, bits.u16() / 20, rgba(), rgba()) for _ in range(cnt)]
    def records():
        bits.align(); nf, nl = bits.ub(4), bits.ub(4); out = []
        while True:
            if bits.ub(1) == 0:
                fl = bits.ub(5)
                if fl == 0: break
                mv = None
                if fl & 1: n = bits.ub(5); mv = (bits.sb(n), bits.sb(n))
                f0 = bits.ub(nf) if fl & 2 else None
                f1 = bits.ub(nf) if fl & 4 else None
                ln_ = bits.ub(nl) if fl & 8 else None
                out.append(('S', mv, f0, f1, ln_))
            elif bits.ub(1):
                n = bits.ub(4) + 2
                if bits.ub(1): d = (bits.sb(n), bits.sb(n))
                elif bits.ub(1): d = (0, bits.sb(n))
                else: d = (bits.sb(n), 0)
                out.append(('L', d))
            else:
                n = bits.ub(4) + 2
                out.append(('Q', (bits.sb(n), bits.sb(n)), (bits.sb(n), bits.sb(n))))
        return out
    start = records(); end = records()
    edges = []; i = j = 0
    sx = sy = ex = ey = 0; f0 = f1 = ln_ = 0
    def as_curve(r):                                         # (control delta, anchor delta)
        if r[0] == 'Q': return r[1], r[2]
        dx, dy = r[1]; return (dx / 2, dy / 2), (dx - dx / 2, dy - dy / 2)
    while i < len(start):
        r = start[i]
        if r[0] == 'S':
            e = end[j] if j < len(end) else None
            if e is not None and e[0] == 'S':
                if e[1] is not None: ex, ey = e[1]
                j += 1
            if r[1] is not None: sx, sy = r[1]
            if r[2] is not None: f0 = r[2]
            if r[3] is not None: f1 = r[3]
            if r[4] is not None: ln_ = r[4]
            i += 1; continue
        e = end[j] if j < len(end) else None
        if e is not None and e[0] == 'S':                    # a moveTo only the end shape has
            if e[1] is not None: ex, ey = e[1]
            j += 1; continue
        if e is None: break
        if r[0] == 'L' and e[0] == 'L':
            a = ((sx, sy), (ex, ey)); sx += r[1][0]; sy += r[1][1]; ex += e[1][0]; ey += e[1][1]
            edges.append((a, None, ((sx, sy), (ex, ey)), f0, f1, ln_))
        else:
            (scx, scy), (sax, say) = as_curve(r); (ecx, ecy), (eax, eay) = as_curve(e)
            a = ((sx, sy), (ex, ey)); c = ((sx + scx, sy + scy), (ex + ecx, ey + ecy))
            sx, sy = sx + scx + sax, sy + scy + say; ex, ey = ex + ecx + eax, ey + ecy + eay
            edges.append((a, c, ((sx, sy), (ex, ey)), f0, f1, ln_))
        i += 1; j += 1
    return fills, lines, edges

def morph_cmds(edge_list, closed):
    """Edges chained (closed) or run (open) into a flat command list: 0 = M, 1 = L,
    2 = Q, 3 = Z; each point as start x, y then end x, y, in pixels."""
    P = lambda pt: [round(pt[0][0] / 20, 2), round(pt[0][1] / 20, 2), round(pt[1][0] / 20, 2), round(pt[1][1] / 20, 2)]
    out = []
    if closed:
        starts = {}
        for k, (a, _, _) in enumerate(edge_list): starts.setdefault(a, []).append(k)
        used = [False] * len(edge_list)
        for k in range(len(edge_list)):
            if used[k]: continue
            used[k] = True; a, c, b = edge_list[k]; first = a
            out += [0] + P(a); out += ([2] + P(c) + P(b)) if c else ([1] + P(b))
            while b != first:
                nxt = next((m for m in starts.get(b, ()) if not used[m]), None)
                if nxt is None: break
                used[nxt] = True; _, c, b = edge_list[nxt]
                out += ([2] + P(c) + P(b)) if c else ([1] + P(b))
            out.append(3)
    else:
        at = None
        for a, c, b in edge_list:
            if a != at: out += [0] + P(a)
            out += ([2] + P(c) + P(b)) if c else ([1] + P(b)); at = b
    return '[' + ','.join(('%g' % v) for v in out) + ']'

def cmd_morph(path, ids):
    _, b, off = load(path)
    want = set(ids); found = {}
    def walk(o, end):
        for code, p0, ln in tags(b, o, end):
            body = b[p0:p0 + ln]
            if code == 46 and struct.unpack('<H', body[:2])[0] in want:
                found[struct.unpack('<H', body[:2])[0]] = morph_shape(body)
            elif code == 39: walk(p0 + 4, p0 + ln)
    walk(off, len(b))
    col = lambda c: js_colour('#%02x%02x%02x' % tuple(c[:3]), c[3])
    def fill_js(f):
        if f[0] == 'solid': return '{t:"s",c:[%s,%s]}' % (col(f[1]), col(f[2]))
        if f[0] in ('linear', 'radial'):
            st = ','.join('[%s,%s,%s,%s]' % (('%.4f' % (r0 / 255)).rstrip('0').rstrip('.') or '0', col(c0),
                                              ('%.4f' % (r1 / 255)).rstrip('0').rstrip('.') or '0', col(c1))
                          for r0, c0, r1, c1 in f[3])
            return '{t:"%s",m:[[%s],[%s]],s:[%s]}' % (f[0][0], ','.join(str(v) for v in f[1]),
                                                     ','.join(str(v) for v in f[2]), st)
        return '{t:"s",c:["#808080","#808080"]}'
    print('{')
    for cid in ids:
        if cid not in found: continue
        fills, lines, edges = found[cid]
        fs = []
        for k in range(1, len(fills) + 1):
            mine = [(a, c, e) for a, c, e, g0, g1, _ in edges if g1 == k and g0 != k] + \
                   [(e, c, a) for a, c, e, g0, g1, _ in edges if g0 == k and g1 != k]
            if mine: fs.append('[%s,%s]' % (fill_js(fills[k - 1]), morph_cmds(mine, True)))
        ls = []
        for k in range(1, len(lines) + 1):
            mine = [(a, c, e) for a, c, e, _, _, g in edges if g == k]
            if mine:
                w0, w1, c0, c1 = lines[k - 1]
                ls.append('[[%g,%g],[%s,%s],%s]' % (w0, w1, col(c0), col(c1), morph_cmds(mine, False)))
        print('  %d: {fills:[%s], strokes:[%s]},' % (cid, ','.join(fs), ','.join(ls)))
    print('}')

def png_bytes(w, h, rgba):
    raw = b''.join(b'\x00' + rgba[y * w * 4:(y + 1) * w * 4] for y in range(h))
    def chunk(t, d): return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    return (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)) +
            chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b''))

def jpeg_clean(d):
    # Flash-era encoders wrote an erroneous FFD9FFD8 before the real SOI
    while d[:4] == b'\xff\xd9\xff\xd8': d = d[4:]
    return d

def jpeg_size(d):
    p = 2
    while p < len(d) - 8:
        if d[p] != 0xFF: p += 1; continue
        m = d[p + 1]
        if m in (0xC0, 0xC1, 0xC2):
            h, w = struct.unpack('>HH', d[p + 5:p + 9]); return w, h
        if m in (0xD8, 0x01) or 0xD0 <= m <= 0xD7: p += 2; continue
        p += 2 + struct.unpack('>H', d[p + 2:p + 4])[0]
    return None

def lossless_rgba(body, alpha2):
    fmt = body[2]; w, h = struct.unpack('<HH', body[3:7])
    if fmt == 3:
        n = body[7] + 1; data = zlib.decompress(body[8:])
        cw = 4 if alpha2 else 3; table = data[:n * cw]; pix = data[n * cw:]
        stride = (w + 3) & ~3; out = bytearray(w * h * 4)
        for y in range(h):
            for x in range(w):
                i = pix[y * stride + x]; c = table[i * cw:i * cw + cw]
                out[(y * w + x) * 4:(y * w + x) * 4 + 4] = bytes(c) + (b'' if alpha2 else b'\xff')
    elif fmt == 4:
        data = zlib.decompress(body[7:]); stride = (w * 2 + 3) & ~3; out = bytearray(w * h * 4)
        for y in range(h):
            for x in range(w):
                v = struct.unpack('>H', data[y * stride + x * 2:y * stride + x * 2 + 2])[0]
                out[(y * w + x) * 4:(y * w + x) * 4 + 4] = bytes(
                    (((v >> 10) & 31) * 255 // 31, ((v >> 5) & 31) * 255 // 31, (v & 31) * 255 // 31, 255))
    else:
        data = zlib.decompress(body[7:]); out = bytearray(w * h * 4)
        for i in range(w * h):
            a, r, g, b = data[i * 4:i * 4 + 4]
            if not alpha2: a = 255
            elif 0 < a < 255: r, g, b = (min(255, c * 255 // a) for c in (r, g, b))
            out[i * 4:i * 4 + 4] = bytes((r, g, b, a))
    # un-premultiply the colour-mapped RGBA table too
    if alpha2 and fmt == 3:
        for i in range(0, len(out), 4):
            a = out[i + 3]
            if 0 < a < 255: out[i:i + 3] = bytes(min(255, c * 255 // a) for c in out[i:i + 3])
    return w, h, bytes(out)

def fonts_of(b, off):
    """font id -> {'name', 'bold', 'italic', 'codes': [char code per glyph]}"""
    fonts = {}
    def walk(o, end):
        for code, p0, ln in tags(b, o, end):
            body = b[p0:p0 + ln]
            if code == 39: walk(p0 + 4, p0 + ln)
            elif code == 10:
                fid = struct.unpack('<H', body[:2])[0]
                n = struct.unpack('<H', body[2:4])[0] // 2 if ln > 3 else 0
                fonts[fid] = {'name': '?', 'bold': False, 'italic': False, 'codes': [], 'n': n}
            elif code in (13, 62):
                fid = struct.unpack('<H', body[:2])[0]; nl = body[2]
                name = body[3:3 + nl].decode('latin1').rstrip('\0'); fl = body[3 + nl]; p = 4 + nl
                if code == 62: p += 1
                wide = code == 62 or fl & 1
                f = fonts.setdefault(fid, {'n': 0}); n = f.get('n') or (len(body) - p) // (2 if wide else 1)
                f.update(name=name, bold=bool(fl & 2), italic=bool(fl & 4),
                         codes=[struct.unpack('<H', body[p + 2 * i:p + 2 * i + 2])[0] if wide else body[p + i]
                                for i in range(n)])
            elif code in (48, 75):
                fid = struct.unpack('<H', body[:2])[0]; fl = body[2]; nl = body[4]
                name = body[5:5 + nl].decode('latin1').rstrip('\0'); p = 5 + nl
                n = struct.unpack('<H', body[p:p + 2])[0]; p += 2
                wo, wc = fl & 0x08, fl & 0x04; ot = p
                if n:
                    cto = struct.unpack('<I', body[ot + 4 * n:ot + 4 * n + 4])[0] if wo else \
                        struct.unpack('<H', body[ot + 2 * n:ot + 2 * n + 2])[0]
                    cp = ot + cto
                    codes = [struct.unpack('<H', body[cp + 2 * i:cp + 2 * i + 2])[0] if wc else body[cp + i]
                             for i in range(n)]
                else: codes = []
                fonts[fid] = {'name': name, 'bold': bool(fl & 1), 'italic': bool(fl & 2), 'codes': codes}
    walk(off, len(b))
    return fonts

def cmd_statictext(path, ids):
    _, b, off = load(path)
    fonts = fonts_of(b, off)
    def walk(o, end):
        for code, p0, ln in tags(b, o, end):
            body = b[p0:p0 + ln]
            if code == 39: walk(p0 + 4, p0 + ln)
            elif code in (11, 33):
                cid = struct.unpack('<H', body[:2])[0]
                if ids and cid not in ids: continue
                bits = Bits(body, 2); bnd = rect(bits); mtx = matrix(bits); p = bits.byte()
                gb, ab = body[p], body[p + 1]; p += 2
                print('text id=%d bounds=%s mtx=%s' % (cid, bnd, mtx))
                font = None; size = colour = None; x = y = 0
                while p < len(body) and body[p]:
                    fl = body[p]; p += 1
                    if fl & 0x08: font = struct.unpack('<H', body[p:p + 2])[0]; p += 2
                    if fl & 0x04:
                        n = 4 if code == 33 else 3; colour = '#' + body[p:p + 3].hex() + (
                            '' if n == 3 or body[p + 3] == 255 else '/%d' % body[p + 3]); p += n
                    if fl & 0x01: x = struct.unpack('<h', body[p:p + 2])[0] / 20; p += 2
                    if fl & 0x02: y = struct.unpack('<h', body[p:p + 2])[0] / 20; p += 2
                    if fl & 0x08: size = struct.unpack('<H', body[p:p + 2])[0] / 20; p += 2
                    count = body[p]; p += 1
                    bits = Bits(body, p); chars = []; adv = 0
                    f = fonts.get(font, {})
                    for _ in range(count):
                        g = bits.ub(gb); a = bits.sb(ab); adv += a / 20
                        cs = f.get('codes', [])
                        chars.append(chr(cs[g]) if g < len(cs) else '?')
                    p = bits.byte()
                    print('  font=%s %s%s%s size=%s colour=%s x=%s y=%s w=%.2f %r' % (
                        font, f.get('name', '?'), ' bold' if f.get('bold') else '', ' italic' if f.get('italic') else '',
                        size, colour, x, y, adv, ''.join(chars)))
                    x += adv
    walk(off, len(b))

def cmd_bitmaps(path, outdir):
    import os, subprocess
    _, b, off = load(path)
    tables = [None]
    if outdir: os.makedirs(outdir, exist_ok=True)
    def save(name, data):
        if outdir: open(os.path.join(outdir, name), 'wb').write(data)
    def walk(o, end):
        for code, p0, ln in tags(b, o, end):
            body = b[p0:p0 + ln]
            if code == 8: tables[0] = jpeg_clean(body)
            elif code == 39: walk(p0 + 4, p0 + ln)
            elif code in (6, 21, 35, 90):
                cid = struct.unpack('<H', body[:2])[0]
                if code == 6:
                    img = jpeg_clean(body[2:])
                    if tables[0]: img = tables[0][:-2] + img[2:]
                    alpha = None
                elif code == 21: img = jpeg_clean(body[2:]); alpha = None
                else:
                    ao = struct.unpack('<I', body[2:6])[0]; s = 8 if code == 90 else 6
                    img = jpeg_clean(body[s:s + ao]); alpha = zlib.decompress(body[s + ao:]) if len(body) > s + ao else None
                kind = 'png' if img[:4] == b'\x89PNG' else 'gif' if img[:3] == b'GIF' else 'jpg'
                size = jpeg_size(img) if kind == 'jpg' else None
                print('bitmap id=%d tag=%d %s %s%s' % (cid, code, kind, '%dx%d' % size if size else '?',
                      ' +alpha' if alpha else ''))
                if alpha and kind == 'jpg' and size and outdir:
                    rgb = subprocess.run(['ffmpeg', '-v', 'error', '-i', '-', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                                         input=img, capture_output=True).stdout
                    w, h = size; rgba = bytearray(w * h * 4)
                    for i in range(w * h):
                        rgba[i * 4:i * 4 + 3] = rgb[i * 3:i * 3 + 3]; rgba[i * 4 + 3] = alpha[i]
                    save('%d.png' % cid, png_bytes(w, h, bytes(rgba)))
                else:
                    save('%d.%s' % (cid, kind), img)
            elif code in (20, 36):
                cid = struct.unpack('<H', body[:2])[0]
                w, h, rgba = lossless_rgba(body, code == 36)
                print('bitmap id=%d tag=%d lossless fmt=%d %dx%d' % (cid, code, body[2], w, h))
                save('%d.png' % cid, png_bytes(w, h, rgba))
    walk(off, len(b))

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(__doc__ or 'usage: swf-inspect.py text|place|shapes|fills|edges|canvas|morph|statictext|bitmaps <file.swf> [...]'); sys.exit(1)
    if sys.argv[1] == 'bitmaps':
        cmd_bitmaps(sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None); sys.exit(0)
    if sys.argv[1] == 'statictext':
        cmd_statictext(sys.argv[2], [int(x) for x in sys.argv[3].split(',')] if len(sys.argv) > 3 else []); sys.exit(0)
    cmd, path = sys.argv[1], sys.argv[2]
    ids = [int(x) for x in sys.argv[3].split(',')] if len(sys.argv) > 3 and sys.argv[3] != 'all' else []
    if cmd == 'text': cmd_text(path)
    elif cmd == 'place': cmd_place(path, len(sys.argv) > 3 and sys.argv[3] == 'all')
    elif cmd == 'shapes': cmd_shapes(path, ids)
    elif cmd == 'fills': cmd_fills(path, ids)
    elif cmd == 'edges': cmd_edges(path, ids)
    elif cmd == 'canvas': cmd_canvas(path, ids)
    elif cmd == 'morph': cmd_morph(path, ids)
    else: print('unknown command', cmd); sys.exit(1)
