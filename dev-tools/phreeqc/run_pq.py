import sys, os, glob
from phreeqpython import PhreeqPython
DB=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'minteq.v4.dat')
def r4(v): return round(v,4) if isinstance(v,float) else v
for f in sorted(glob.glob(sys.argv[1])):
    txt=open(f).read(); print('=====',os.path.basename(f))
    parts=txt.split('# ---- Question 2')
    pp=PhreeqPython(database=DB); ip=pp.ip
    try:
        ip.run_string(parts[0] if len(parts)>1 else txt); a=ip.get_selected_output_array()
        h=a[0]; last=a[-1]; print(' batch', {h[i]:r4(last[i]) for i in range(len(h)) if h[i] in ('pH','pe','dissolved_ug/L','sorbed_mg/kg','precipitated_mg/kg','Kd_L/kg') or (h[i].startswith('si_') and isinstance(last[i],float) and last[i]>-3) or h[i].startswith('m_')})
    except Exception as e: print(' BATCH ERR', str(e)[:500])
    if len(parts)>1:
        pp2=PhreeqPython(database=DB); ip2=pp2.ip
        q2=parts[1].replace('SELECTED_OUTPUT 1\n    -active   false\n','').replace('SELECTED_OUTPUT 2','SELECTED_OUTPUT 1').replace('USER_PUNCH 2','USER_PUNCH 1')
        # batch first (sim must exist), but deactivate its punch so only column rows appear
        try:
            ip2.run_string(parts[0].replace('SELECTED_OUTPUT 1\n','SELECTED_OUTPUT 9\n').replace('USER_PUNCH 1\n','USER_PUNCH 9\n')+'# ---- Question 2'+q2)
            a=ip2.get_selected_output_array(); h=a[0]
            iy=h.index('years'); rows=a[1:]
            N=int(max(r[iy+1] for r in rows))
            bt=[r for r in rows if r[iy+1]==N]
            pick=[bt[i] for i in sorted(set([0,len(bt)//4,len(bt)//2,3*len(bt)//4,len(bt)-1]))]
            print(' breakthrough last cell (yr, ug/L):', [[r4(r[iy]),r4(r[iy+3])] for r in pick])
            tl=rows[-1][iy]; prof=[r for r in rows if r[iy]==tl]
            print(' final profile (depth, ug/L, mg/kg):', [[r4(r[iy+2]),r4(r[iy+3]),r4(r[iy+4])] for r in prof][::max(1,len(prof)//5)])
        except Exception as e: print(' COL ERR', str(e)[:500])
