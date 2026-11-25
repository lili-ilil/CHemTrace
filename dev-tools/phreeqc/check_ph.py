import sys, glob, os, re
from phreeqpython import PhreeqPython
DB=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'minteq.v4.dat')
reag = sys.argv[2] if len(sys.argv)>2 else None
bad=0; tot=0
for f in sorted(glob.glob(sys.argv[1])):
    txt=open(f).read(); q1=txt.split('# ---- Question 2')[0]
    m=re.search(r'Fix_H\+\s+(-?[\d.]+)\s+(\S+)\s+10', q1)
    if not m: continue
    target=-float(m.group(1))
    if reag: q1=q1.replace(m.group(0), f'Fix_H+    {m.group(1)}   {reag}   10')
    pp=PhreeqPython(database=DB); ip=pp.ip; tot+=1
    try:
        ip.run_string(q1); a=ip.get_selected_output_array(); ph=a[-1][0]
        ok = abs(ph-target)<0.01
        if not ok: bad+=1
        print(f"{os.path.basename(f):32s} target {target:4.1f} got {ph:6.3f} {'ok' if ok else 'NOT HELD'}")
    except Exception as e:
        bad+=1; print(f"{os.path.basename(f):32s} FAILED {str(e)[:80]}")
print('bad', bad, 'of', tot)
