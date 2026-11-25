# Rebuilds docs/data/grid.bin and grid.json from the downloads in ../data.
# Usage: python tools/process_data.py all   (needs numpy, rasterio, pyproj, shapely, pyogrio; the 'pm' step downloads the FOEN PM maps once)
# Extracts what it needs from the ZIPs into ../work (about 1.3 GB) on the first run. Delete ../work afterwards if you like.
import numpy as np, rasterio, json, os, csv, time, sys
from rasterio.warp import reproject, Resampling
from rasterio.transform import from_origin
from rasterio.features import rasterize
import pyogrio, shapely
import zipfile, glob, shutil
BASE=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D=os.path.join(BASE,'data'); OUT=os.path.join(BASE,'docs','data'); W=os.path.join(BASE,'work')
def ensure():
    for d in ('src','atlas','hydro'): os.makedirs(os.path.join(W,d), exist_ok=True)
    pairs=[('soil_properties/Geodaten_pH_CH.zip','Geodaten_pH_CH/CH_pH_0_30/CH_pH_0_30.tif','src/CH_pH_0_30.tif'),
           ('soil_properties/Geodaten_Ton_CH.zip','Geodaten_Ton_CH/CH_Ton_0_30/CH_ton_0_30.tif','src/CH_ton_0_30.tif'),
           ('soil_properties/CH_SOCstock_0_120.zip','CH_SOCstock_0_120/CH_SOCstock_0_120.tif','src/CH_SOCstock_0_120.tif')]
    for z,inner,dst in pairs:
        dst=os.path.join(W,dst)
        if not os.path.exists(dst):
            with zipfile.ZipFile(os.path.join(D,z)) as zf, zf.open(inner) as fi, open(dst,'wb') as fo: shutil.copyfileobj(fi,fo,1<<20)
    for z in glob.glob(os.path.join(D,'soil_atlas','*.zip')):
        with zipfile.ZipFile(z) as zf: zf.extractall(os.path.join(W,'atlas'))
    if not os.path.exists(os.path.join(W,'hydro','GK500_V1_3_DE','Shapes','PY_Basis_Flaechen.shp')):
        with zipfile.ZipFile(os.path.join(D,'hydrogeology','data.zip')) as zf: zf.extract('GK500_V1_3_Vector.zip', os.path.join(W,'hydro'))
        with zipfile.ZipFile(os.path.join(W,'hydro','GK500_V1_3_Vector.zip')) as zf:
            for n in zf.namelist():
                if n.startswith('GK500_V1_3_DE/Shapes/PY_Basis_Flaechen.'): zf.extract(n, os.path.join(W,'hydro'))
ensure()
os.makedirs(OUT, exist_ok=True)
X0,Y1,RES,NC,NR = 2483000,1298000,1000,353,225
TF = from_origin(X0,Y1,RES,RES); CRS='EPSG:2056'
def log(*a): print(time.strftime('%H:%M:%S'), *a, flush=True)
def warp(path, rs, dtype='float32', fill=np.nan, src_nodata=None):
    dst = np.full((NR,NC), fill, dtype=dtype)
    with rasterio.open(path) as s:
        nd = s.nodata if src_nodata is None else src_nodata
        reproject(rasterio.band(s,1), dst, src_transform=s.transform, src_crs=s.crs, src_nodata=nd,
                  dst_transform=TF, dst_crs=CRS, dst_nodata=fill, resampling=rs, warp_mem_limit=512, num_threads=2)
    return dst
L = {}
step = sys.argv[1] if len(sys.argv)>1 else 'all'
cache = W+'/layers.npz'
if os.path.exists(cache): L = dict(np.load(cache))
def save(): np.savez(cache, **L)
if step in ('all','clim'):
    for k,f in [('precip','rnormy9120'),('temp','tnormy9120')]:
        p=[x for x in os.listdir(D+'/meteoswiss') if f in x][0]
        a=warp(D+'/meteoswiss/'+p, Resampling.nearest, src_nodata=-999); L[k]=a; log(k, np.nanmin(a), np.nanmax(a))
    save()
if step in ('all','atlas'):
    for k,f in [('As','Arsen'),('Pb','Blei'),('Hg','Quecksilber'),('Sb','Antimon'),('Fe','Eisen'),('Ca','Calcium'),('Cd','Cadmium'),('Cu','Kupfer'),('Zn','Zink'),('Ni','Nickel'),('Cr','Chrom')]:
        a=warp(W+'/atlas/GCBA_%s.tif'%f, Resampling.nearest, dtype='float32', fill=0, src_nodata=0); L['atl_'+k]=a; log(k, np.unique(a))
    save()
if step in ('all','soil'):
    for k,p in [('ph',W+'/src/CH_pH_0_30.tif'),('clay',W+'/src/CH_ton_0_30.tif'),('soc',W+'/src/CH_SOCstock_0_120.tif')]:
        t=time.time(); a=warp(p, Resampling.average); L[k]=a; log(k, np.nanmin(a), np.nanmax(a), 'valid', int(np.isfinite(a).sum()), round(time.time()-t),'s'); save()
if step in ('all','hydro'):
    shp=W+'/hydro/GK500_V1_3_DE/Shapes/PY_Basis_Flaechen.shp'
    meta, fid, geom, fields = pyogrio.raw.read(shp)
    names=list(meta['fields']); hg=fields[names.index('HYDROGEOL')]; gk=fields[names.index('GESTEINKL')]
    HMAP={'Sehr ergiebige Grundwasservorkommen in den Talsohlen':1,'Ergiebige Grundwasservorkommen z.T. ausserhalb von Talsohlen':2,'Weniger ergiebige Grundwasservorkommen':3,
          'Grundwasservorkommen in verkarstungsfaehigen Festgesteinen':4,'Weniger ergiebige Grundwasservorkommen in gekluefteten und poroesen, nicht verkarstungsfaehigen Festgesteinen':5,
          'Gebiete ohne ergiebige Grundwasservorkommen':6,'Gletscher, Firn':7,'Oberflaechengewaesser':8,'unbestimmt':0}
    GMAP={'Lockergesteine':1,'Sedimentgesteine':2,'Magmatische Gesteine':3,'Metamorphe Gesteine':4,'Gletscher, Firn':5,'Gewässer, Seen':6}
    geoms=shapely.from_wkb(geom); geoms=shapely.transform(geoms, lambda c: c+np.array([2000000.0,1000000.0]))
    L['hydro']=rasterize(zip(geoms,[HMAP.get(v,0) for v in hg]), out_shape=(NR,NC), transform=TF, fill=0, dtype='uint8').astype('float32')
    L['rock']=rasterize(zip(geoms,[GMAP.get(v,0) for v in gk]), out_shape=(NR,NC), transform=TF, fill=0, dtype='uint8').astype('float32')
    log('hydro', np.unique(L['hydro'], return_counts=True)); save()
if step in ('all','landuse'):
    cnt=np.zeros((5,NR,NC),dtype=np.int32)
    with open(D+'/landuse/ag-b-00.03-37-area-current-csv.csv', newline='') as fh:
        r=csv.reader(fh, delimiter=';'); hdr=next(r); iE,iN,iL=hdr.index('E_COORD'),hdr.index('N_COORD'),hdr.index('LU_4')
        E=[];N=[];C=[]
        for row in r:
            E.append(int(row[iE])); N.append(int(row[iN])); C.append(int(row[iL]))
    E=np.array(E);N=np.array(N);C=np.array(C)
    col=((E+50-X0)//RES).astype(int); rowi=((Y1-(N+50))//RES).astype(int)
    ok=(col>=0)&(col<NC)&(rowi>=0)&(rowi<NR)&(C>=1)&(C<=4)
    np.add.at(cnt,(C[ok],rowi[ok],col[ok]),1)
    tot=cnt.sum(0); maj=np.argmax(cnt,axis=0).astype('float32'); maj[tot==0]=0
    L['lu4']=maj; L['lu_set']=np.where(tot>0, cnt[1]*100.0/np.maximum(tot,1), 0).astype('float32')
    log('landuse', np.unique(maj, return_counts=True)); save()
if step in ('all','pm'):
    # FOEN annual mean maps of PM10 and PM2.5 (100 m grid), averaged over 2023-2025; downloaded once into data/air_quality
    import urllib.request
    AQ=os.path.join(D,'air_quality'); os.makedirs(AQ, exist_ok=True)
    for k,p in [('pm10','pm10'),('pm25','pm2_5')]:
        arrs=[]
        for y in (2023,2024,2025):
            f=os.path.join(AQ,'luftreinhaltung-feinstaub_%s_%d_2056.tif'%(p,y))
            if not os.path.exists(f):
                url='https://data.geo.admin.ch/ch.bafu.luftreinhaltung-feinstaub_%s/luftreinhaltung-feinstaub_%s_%d/luftreinhaltung-feinstaub_%s_%d_2056.tif'%(p,p,y,p,y)
                log('download', url); urllib.request.urlretrieve(url, f)
            arrs.append(warp(f, Resampling.average, src_nodata=-9999))
        L[k]=np.nanmean(np.stack(arrs), axis=0); log(k, np.nanmin(L[k]), np.nanmax(L[k]))
    save()
if step in ('all','write'):
    spec=[('precip','u16',1,0,65535),('temp','i16',10,0,-32768),('ph','u8',20,0,0),('clay','u8',1,0,255),('soc','u16',1,0,65535),
          ('atl_As','u8',1,0,0),('atl_Pb','u8',1,0,0),('atl_Hg','u8',1,0,0),('atl_Sb','u8',1,0,0),('atl_Fe','u8',1,0,0),('atl_Ca','u8',1,0,0),
          ('hydro','u8',1,0,0),('rock','u8',1,0,0),('lu4','u8',1,0,0),('lu_set','u8',1,0,255),
          ('pm10','u16',10,0,65535),('pm25','u16',10,0,65535),
          ('atl_Cd','u8',1,0,0),('atl_Cu','u8',1,0,0),('atl_Zn','u8',1,0,0),('atl_Ni','u8',1,0,0),('atl_Cr','u8',1,0,0)]   # added in 0.14.0, appended so older offsets stay the same
    DT={'u8':np.uint8,'u16':np.uint16,'i16':np.int16}
    buf=bytearray(); layers=[]
    for name,t,sc,off,nd in spec:
        a=L[name].astype('float64'); bad=~np.isfinite(a)
        if name in ('precip','temp'): bad|= a<=-998
        q=np.round(a*sc+off); q[bad]=nd
        if name=='ph': q[(~bad)&(q<1)]=1
        q=q.astype(DT[t]).astype('<'+np.dtype(DT[t]).str[1:])
        while len(buf)%4: buf.append(0)
        layers.append({'name':name,'type':t,'scale':sc,'offset':off,'nodata':nd,'byteOffset':len(buf)})
        buf+=q.tobytes()
    open(OUT+'/grid.bin','wb').write(buf)
    meta={'crs':'EPSG:2056','x0':X0,'y1':Y1,'res':RES,'ncols':NC,'nrows':NR,'layers':layers,'generated':time.strftime('%Y-%m-%d')}
    json.dump(meta, open(OUT+'/grid.json','w'), indent=1)
    log('wrote', len(buf), 'bytes')
    for nm,(x,y) in {'Zurich':(2683000,1248000),'Visp':(2634000,1127500),'Lugano':(2717000,1096000),'LaChauxDeFonds':(2553000,1217000),'Bern':(2600000,1200000)}.items():
        c=(x-X0)//RES; r=(Y1-y)//RES
        print(nm, {k: (None if not np.isfinite(L[k][r,c]) else round(float(L[k][r,c]),2)) for k,_,_,_,_ in spec})
