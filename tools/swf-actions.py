#!/usr/bin/env python3
# =============================================================================
#  tools/swf-actions.py  —  DEV TOOL: read an original SWF's ActionScript
#  -----------------------------------------------------------------------------
#  Walks an AS1/AS2-era SWF (Flash ≤ 8, zlib "CWS" or plain "FWS"), finds every
#  DoAction / DoInitAction block (including those inside sprites) and prints a
#  rough decompilation: expressions are rebuilt on a stack and each side effect
#  becomes one statement. Branches show up as `if (cond) jump +N;` — crude, but
#  enough to read the author's real formulas, tables and drawing code instead of
#  guessing them from screenshots.
#
#  Usage:  python3 tools/swf-actions.py <file.swf> [word ...]
#          (with words, only blocks mentioning one of them are printed)
#  e.g.    python3 tools/swf-actions.py \
#            originals/classaction/animations/telescopes/telescope10.swf drawTelescope
# =============================================================================
import zlib, struct, sys
data=open(sys.argv[1],'rb').read()
if data[:3]==b'CWS': data=data[:8]+zlib.decompress(data[8:])
pos=8; nbits=data[pos]>>3; pos+= (5+nbits*4+7)//8; pos+=4
OPS={0x0A:'+',0x0B:'-',0x0C:'*',0x0D:'/',0x0E:'==',0x0F:'<',0x10:'&&',0x11:'||',0x13:'eq',0x21:'add',0x3F:'%',0x47:'+',0x48:'<',0x49:'==',0x67:'>',0x66:'===',0x60:'&',0x61:'|',0x62:'^',0x63:'<<',0x64:'>>',0x65:'>>>'}
PROPS=['_x','_y','_xscale','_yscale','_currentframe','_totalframes','_alpha','_visible','_width','_height','_rotation','_target','_framesloaded','_name','_droptarget','_url','_highquality','_focusrect','_soundbuftime','_quality','_xmouse','_ymouse']
def cstr(b,i):
    j=b.index(0,i); return b[i:j].decode('latin1'), j+1
def decompile(code, pool, indent=0, out=None):
    out = out if out is not None else []
    st=[]; i=0; pad='  '*indent; reg={}
    def pop(): return st.pop() if st else '?'
    while i < len(code):
        op=code[i]; i+=1; L=0; d=b''
        if op>=0x80:
            L=struct.unpack('<H',code[i:i+2])[0]; d=code[i+2:i+2+L]; i+=2+L
        if op==0: break
        if op==0x88:
            n=struct.unpack('<H',d[:2])[0]; k=2; pool[:]=[]
            for _ in range(n): s,k=cstr(d,k); pool.append(s)
        elif op==0x96:
            k=0
            while k<len(d):
                t=d[k]; k+=1
                if t==0: s,k=cstr(d,k); st.append(repr(s))
                elif t==1: st.append(str(struct.unpack('<f',d[k:k+4])[0])); k+=4
                elif t==2: st.append('null')
                elif t==3: st.append('undefined')
                elif t==4: st.append('r%d'%d[k]); k+=1
                elif t==5: st.append('true' if d[k] else 'false'); k+=1
                elif t==6: v=struct.unpack('<d',d[k+4:k+8]+d[k:k+4])[0]; st.append(('%g'%v)); k+=8
                elif t==7: st.append(str(struct.unpack('<i',d[k:k+4])[0])); k+=4
                elif t==8: st.append(repr(pool[d[k]]) if d[k]<len(pool) else 'c%d'%d[k]); k+=1
                elif t==9: ix=struct.unpack('<H',d[k:k+2])[0]; st.append(repr(pool[ix]) if ix<len(pool) else 'c%d'%ix); k+=2
        elif op in OPS: b=pop(); a=pop(); st.append('(%s %s %s)'%(a,OPS[op],b))
        elif op==0x12: st.append('!(%s)'%pop())
        elif op==0x17: v=pop(); out.append(pad+v+';') if v.startswith(('call ','new ')) or '(' in v and v.endswith(')') and not v.startswith('(') else None
        elif op==0x18: st.append('int(%s)'%pop())
        elif op==0x1C: st.append(pop().strip("'"))
        elif op==0x1D: v=pop(); n=pop(); out.append(pad+'%s = %s;'%(n.strip("'"),v))
        elif op==0x3C: v=pop(); n=pop(); out.append(pad+'var %s = %s;'%(n.strip("'"),v))
        elif op==0x41: n=pop(); out.append(pad+'var %s;'%n.strip("'"))
        elif op==0x22: p=pop(); t=pop(); pn=PROPS[int(float(p))] if p.replace('.','').isdigit() and int(float(p))<len(PROPS) else p; st.append('%s.%s'%(t.strip("'"),pn))
        elif op==0x23: v=pop(); p=pop(); t=pop(); pn=PROPS[int(float(p))] if p.replace('.','').isdigit() and int(float(p))<len(PROPS) else p; out.append(pad+'%s.%s = %s;'%(t.strip("'"),pn,v))
        elif op==0x3D:
            n=pop(); c=int(float(pop())) if st else 0; args=[pop() for _ in range(c)]; st.append('%s(%s)'%(n.strip("'"),', '.join(args)))
        elif op==0x52:
            m=pop(); o=pop(); c=int(float(pop())) if st else 0; args=[pop() for _ in range(c)]
            st.append('%s.%s(%s)'%(o,m.strip("'"),', '.join(args)) if m not in ("''",'undefined') else '%s(%s)'%(o,', '.join(args)))
        elif op==0x53:
            m=pop(); o=pop(); c=int(float(pop())) if st else 0; args=[pop() for _ in range(c)]; st.append('new %s.%s(%s)'%(o,m.strip("'"),', '.join(args)))
        elif op==0x40:
            n=pop(); c=int(float(pop())) if st else 0; args=[pop() for _ in range(c)]; st.append('new %s(%s)'%(n.strip("'"),', '.join(args)))
        elif op==0x4E: m=pop(); o=pop(); st.append('%s.%s'%(o,m.strip("'")))
        elif op==0x4F: v=pop(); m=pop(); o=pop(); out.append(pad+'%s.%s = %s;'%(o,m.strip("'"),v))
        elif op==0x3E: out.append(pad+'return %s;'%pop())
        elif op==0x50: st.append('(%s + 1)'%pop())
        elif op==0x51: st.append('(%s - 1)'%pop())
        elif op==0x4C: v=st[-1] if st else '?'; st.append(v)
        elif op==0x4D: b=pop(); a=pop(); st.append(b); st.append(a)
        elif op==0x4A: st.append('Number(%s)'%pop())
        elif op==0x4B: st.append('String(%s)'%pop())
        elif op==0x44: st.append('typeof(%s)'%pop())
        elif op==0x42:
            c=int(float(pop())) if st else 0; st.append('[%s]'%', '.join(pop() for _ in range(c)))
        elif op==0x43:
            c=int(float(pop())) if st else 0; items=[]
            for _ in range(c): v=pop(); n=pop(); items.append('%s:%s'%(n.strip("'"),v))
            st.append('{%s}'%', '.join(items))
        elif op==0x87: reg[d[0]]=st[-1] if st else '?'; out.append(pad+'r%d = %s;'%(d[0], st[-1] if st else '?'))
        elif op==0x30: st.append('random(%s)'%pop())
        elif op==0x26: out.append(pad+'trace(%s);'%pop())
        elif op==0x9D: out.append(pad+'if (%s) jump %+d;'%(pop(), struct.unpack('<h',d)[0]))
        elif op==0x99: out.append(pad+'jump %+d;'%struct.unpack('<h',d)[0])
        elif op in (0x9B,0x8E):
            name,k=cstr(d,0); np_=struct.unpack('<H',d[k:k+2])[0]; k+=2
            params=[]
            if op==0x8E:
                k+=3
                for _ in range(np_): r=d[k]; k+=1; p,k=cstr(d,k); params.append(p or 'r%d'%r)
            else:
                for _ in range(np_): p,k=cstr(d,k); params.append(p)
            size=struct.unpack('<H',d[k:k+2])[0]
            body=code[i:i+size]; i+=size
            sub=[]; decompile(body, pool, indent+1, sub)
            text='function %s(%s) {'%(name,', '.join(params))
            if name: out.append(pad+text); out.extend(sub); out.append(pad+'}')
            else: st.append('FUNC'); out.append(pad+'/* anon */ '+text); out.extend(sub); out.append(pad+'}')
        elif op==0x94: size=struct.unpack('<H',d)[0]; out.append(pad+'with (%s) { /* %d bytes */'%(pop(),size))
        elif op==0x8B: out.append(pad+'tellTarget(%r)'%cstr(d,0)[0])
        elif op==0x20: out.append(pad+'tellTarget(%s)'%pop())
        elif op==0x81: out.append(pad+'gotoFrame(%d);'%struct.unpack('<H',d)[0])
        elif op==0x8C: out.append(pad+'gotoLabel(%r);'%cstr(d,0)[0])
        elif op==0x9F: out.append(pad+'gotoAndPlay/Stop(%s);'%pop())
        elif op==0x07: out.append(pad+'stop();')
        elif op==0x06: out.append(pad+'play();')
        elif op==0x3B: n=pop(); out.append(pad+'delete %s;'%n)
        elif op==0x3A: n=pop(); o=pop(); out.append(pad+'delete %s.%s;'%(o,n))
        else: out.append(pad+'/* op 0x%02X */'%op)
    return out
chunks=[]
def walk(b, p, end, depth, where):
    while p<end:
        h=struct.unpack('<H',b[p:p+2])[0]; p+=2; code=h>>6; L=h&0x3f
        if L==0x3f: L=struct.unpack('<I',b[p:p+4])[0]; p+=4
        body=b[p:p+L]
        if code==12: chunks.append((where, body))
        elif code==59: chunks.append((where+'/init%d'%struct.unpack('<H',body[:2])[0], body[2:]))
        elif code==39: walk(body, 4, len(body), depth+1, where+'/sprite%d'%struct.unpack('<H',body[:2])[0])
        elif code in (26,70) and L>3:
            flags=body[0]
            if flags & 0x80:   # PlaceObject2 with clip actions: decode loosely by scanning for event records
                chunks.append((where+'/placeobj-clipactions', body))
        p+=L
walk(data,pos,len(data),0,'root')
pool=[]
want=[w for w in sys.argv[2:]]
for where,body in chunks:
    try: lines=decompile(body, pool)
    except Exception as e: lines=['/* decode error %s */'%e]
    txt='\n'.join(lines)
    if not want or any(w in txt for w in want):
        print('\n//==== %s (%d bytes)'%(where,len(body))); print(txt)
