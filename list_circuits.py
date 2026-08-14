import pandas as pd
import json

df = pd.read_excel('Data/C_Estabilizacion_633km_subregion_tabla.xlsx', sheet_name='SUBREGIONES').iloc[0:29]

with open('Data/Secundaria.geojson', 'r', encoding='utf-8') as f:
    sec = json.load(f)

print("--- ALL 29 CIRCUITS IN EXCEL ---")
for idx, r in df.iterrows():
    print(f"ID {int(r['ID']):02d}: {r['CIRCUITO']} | Subreg: {r['SUBREGION']} | Km: {r['LONG_INTERVENIR']}")

print("\n--- PRIORITIZED ROADS IN SECUNDARIA.GEOJSON ---")
for f in sec['features']:
    p = f['properties']
    if p.get('is_prioritized') or p.get('priorizado'):
        print(f"Road: {p.get('nombre') or p.get('Name')} | Cod: {p.get('codigo')} | Subreg: {p.get('subregion')}")

# Also inspect all properties in Secundaria.geojson
print("\nSample properties of Secundaria:")
print(list(sec['features'][0]['properties'].keys()))
for f in sec['features'][:5]:
    print(f['properties'])
