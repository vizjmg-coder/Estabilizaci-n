import json
import re

with open('Data/Secundaria.geojson', 'r', encoding='utf-8') as f:
    sec = json.load(f)

print(f"Total features in Secundaria: {len(sec['features'])}")

roads = []
for i, feat in enumerate(sec['features']):
    p = feat['properties']
    roads.append({
        'index': i,
        'codigo': p.get('CODIGO_VIA'),
        'nombre': p.get('NOMBRE_VIA'),
        'inicio': p.get('INICIO'),
        'fin': p.get('FIN'),
        'length_km': p.get('L_ODOMETRO') or p.get('L_GPS'),
        'shape_len': p.get('Shape__Len'),
        'ancho': p.get('ANCHO_VIA')
    })

for r in roads:
    print(f"[{r['index']:3d}] Cod: {str(r['codigo']):12s} | Km: {str(r['length_km']):5s} | {r['nombre']}")
