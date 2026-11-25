# Derives ATLAS_PCT in docs/assets/js/app.js for Cd, Cr, Cu, Ni and Zn (version 0.14.0).
# Reusser et al. (2023, CHIMIA) publish the 10th, 50th and 90th percentiles of Swiss topsoils; the site needs the
# 5th, 25th, 50th, 75th and 95th (and an upper value for the top class). A lognormal is fitted separately below and
# above the median, so the published p10 and p90 are reproduced exactly. Usage: python atlas_percentiles.py
import math
D = {"Cd": (0.10, 0.24, 0.62), "Cr": (13.8, 30.3, 52.1), "Cu": (7.7, 18.1, 35.0), "Ni": (10.2, 27.3, 49.8), "Zn": (35, 64, 106)}
r = lambda v: float(f"{v:.3g}")
for m, (p10, p50, p90) in D.items():
    sL, sU = math.log(p50 / p10) / 1.2816, math.log(p90 / p50) / 1.2816
    q = lambda z, s: p50 * math.exp(z * s)
    p = [q(-1.6449, sL), q(-0.6745, sL), p50, q(0.6745, sU), q(1.6449, sU)]
    print(f'{m}:{{p:[{",".join(str(r(v)) for v in p)}], tif:{r(q(2.3263, sU))}}}')
