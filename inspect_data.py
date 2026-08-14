import pandas as pd
import json
import re

df = pd.read_excel('Data/C_Estabilizacion_633km_subregion_tabla.xlsx', sheet_name='SUBREGIONES').iloc[0:29]
sub_cols = ['NORDESTE', 'ORIENTE', 'SUROESTE', 'OCCIDENTE', 'NORTE', 'BAJO CAUCA', 'MAGDALENA MEDIO', 'URABA', 'AREA METROPOLITANA']

with open('Data/Municipios.geojson', 'r', encoding='utf-8') as f:
    mun_data = json.load(f)

with open('Data/Secundaria.geojson', 'r', encoding='utf-8') as f:
    sec_data = json.load(f)

# List of 125 municipalities with name and subregion
all_mun_list = []
for f in mun_data['features']:
    props = f['properties']
    all_mun_list.append({
        'code': props.get('COD_MPIO'),
        'name': props.get('MPIO_NOMBR'),
        'subregion': props.get('SUBREGION'),
        'area': props.get('Shape__Are'),
        'perimeter': props.get('Shape__Len')
    })

print(f"Total municipalities in Antioquia: {len(all_mun_list)}")

# Analyze each circuit
circuits_data = []
for idx, r in df.iterrows():
    breakdown = {}
    for col in sub_cols:
        val = r[col]
        if pd.notna(val) and float(val) > 0:
            # Normalize subregion name
            norm_name = col.title()
            if norm_name == 'Uraba': norm_name = 'Urabá'
            if norm_name == 'Area Metropolitana': norm_name = 'Valle de Aburrá'
            if norm_name == 'Magdalena Medio': norm_name = 'Magdalena Medio'
            if norm_name == 'Bajo Cauca': norm_name = 'Bajo Cauca'
            breakdown[norm_name] = float(val)

    c_obj = {
        'id': int(r['ID']),
        'name': str(r['CIRCUITO']).strip(),
        'multi_subregion': str(r['VARIAS SUBREGIONES']).strip().lower() == 'si',
        'subregion_text': str(r['SUBREGION']).strip(),
        'long_km': float(r['LONG_INTERVENIR']),
        'total_corredor_km': float(r['TOTAL_CORREDOR']),
        'subregion_breakdown': breakdown
    }
    circuits_data.append(c_obj)

print("\n--- PROCESSED CIRCUITS SAMPLE ---")
for c in circuits_data:
    print(c)

# Let's inspect how many total km by subregion
subreg_totals = {}
for c in circuits_data:
    for s, km in c['subregion_breakdown'].items():
        subreg_totals[s] = subreg_totals.get(s, 0) + km

print("\n--- SUBREGION TOTAL KM ---")
for s, km in sorted(subreg_totals.items(), key=lambda x: -x[1]):
    print(f"  {s}: {km:.2f} km ({km / 634.43 * 100:.1f}%)")
