import pandas as pd
import json
import re

excel_path = r'Data/C_Estabilizacion_633km_subregion_tabla.xlsx'
df = pd.read_excel(excel_path, sheet_name='SUBREGIONES')

print("--- EXCEL DATA SHAPE ---", df.shape)
circuits = df.iloc[0:29].copy()

print("\n--- ALL 29 CIRCUITS ---")
for idx, r in circuits.iterrows():
    sub_cols = ['NORDESTE', 'ORIENTE', 'SUROESTE', 'OCCIDENTE', 'NORTE', 'BAJO CAUCA', 'MAGDALENA MEDIO', 'URABA', 'AREA METROPOLITANA']
    sub_dist = {col: r[col] for col in sub_cols if pd.notna(r[col]) and r[col] > 0}
    print(f"ID {r['ID']}: {r['CIRCUITO']} | Subreg: {r['SUBREGION']} | Long: {r['LONG_INTERVENIR']} km | Subreg dist: {sub_dist}")

print("\n--- SUMMARY STATS ---")
print("Sum of LONG_INTERVENIR (circuits 1-29):", circuits['LONG_INTERVENIR'].astype(float).sum())
print("Total Corredor sum:", circuits['TOTAL_CORREDOR'].astype(float).sum())

# Check Municipios.geojson
with open('Data/Municipios.geojson', 'r', encoding='utf-8', errors='replace') as f:
    mun_data = json.load(f)

print("\n--- MUNICIPIOS GEOJSON ---")
print("Features count:", len(mun_data['features']))
mun_names = [feat['properties'].get('MPIO_NOMBR') for feat in mun_data['features']]
mun_subregs = set(feat['properties'].get('SUBREGION') for feat in mun_data['features'])
print("Subregions in Municipios.geojson:", mun_subregs)
print("Sample municipios:", mun_names[:10])

# Check Secundaria.geojson
with open('Data/Secundaria.geojson', 'r', encoding='utf-8', errors='replace') as f:
    sec_data = json.load(f)

print("\n--- SECUNDARIA GEOJSON ---")
print("Features count:", len(sec_data['features']))
sec_names = [feat['properties'].get('NOMBRE_VIA') for feat in sec_data['features']]
print("Sample vias (first 15):")
for name in sec_names[:15]:
    print("  -", name)

# Let's inspect matching between circuit names and secundaria road names / municipios
print("\n--- MATCHING CIRCUITS WITH SECUNDARIA / MUNICIPIOS ---")
for idx, r in circuits.iterrows():
    c_name = str(r['CIRCUITO'])
    # Check if any road name contains words from circuit
    tokens = [t.strip().lower() for t in re.split(r'[-–/]', c_name) if len(t.strip()) > 3]
    matched_roads = []
    for feat in sec_data['features']:
        v_name = str(feat['properties'].get('NOMBRE_VIA') or '').lower()
        if any(tok in v_name for tok in tokens):
            matched_roads.append(feat['properties'].get('NOMBRE_VIA'))
    print(f"Circuit {r['ID']}: {c_name} -> Matched {len(matched_roads)} candidate roads in Secundaria: {matched_roads[:3]}")

