import pandas as pd
import json
import re

# Load Excel
excel_path = 'Data/C_Estabilizacion_633km_subregion_tabla.xlsx'
df = pd.read_excel(excel_path, sheet_name='SUBREGIONES').iloc[0:29]

# Load GeoJSONs
with open('Data/Municipios.geojson', 'r', encoding='utf-8') as f:
    mun_geojson = json.load(f)

with open('Data/Secundaria.geojson', 'r', encoding='utf-8') as f:
    sec_geojson = json.load(f)

subregion_map = {
    'NORDESTE': 'Nordeste',
    'ORIENTE': 'Oriente',
    'SUROESTE': 'Suroeste',
    'OCCIDENTE': 'Occidente',
    'NORTE': 'Norte',
    'BAJO CAUCA': 'Bajo Cauca',
    'MAGDALENA MEDIO': 'Magdalena Medio',
    'URABA': 'Urabá',
    'AREA METROPOLITANA': 'Valle de Aburrá',
    'VALLE DE ABURRA': 'Valle de Aburrá'
}

# EXCLUDED MUNICIPALITIES PER USER INSTRUCTION:
# Chigorodó, Caucasia, Anorí, Nariño, Jericó, La Pintada, La Ceja, San Jerónimo, Angostura, Guadalupe, Apartadó, Toledo, Medellín
EXCLUDED_MPIOS = {
    'CHIGORODÓ', 'CHIGORODO',
    'CAUCASIA',
    'ANORÍ', 'ANORI',
    'NARIÑO', 'NARINO',
    'JERICÓ', 'JERICO',
    'LA PINTADA',
    'LA CEJA',
    'SAN JERÓNIMO', 'SAN JERONIMO',
    'ANGOSTURA',
    'GUADALUPE',
    'APARTADÓ', 'APARTADO',
    'TOLEDO',
    'MEDELLÍN', 'MEDELLIN'
}

# Verified and cleaned circuit to municipalities mapping
circuit_to_mpios_verified = {
    1: ['Cáceres', 'Zaragoza'], # Caucasia excluded
    2: ['Yondó', 'Puerto Berrío'],
    3: ['Cisneros', 'Caramanta', 'San Roque', 'Santo Domingo'],
    4: ['San Rafael', 'San Roque', 'Santo Domingo', 'Alejandría'],
    5: ['Amalfi'], # Anorí excluded
    6: ['Remedios', 'Puerto Berrío', 'Puerto Nare'],
    7: ['Carolina', 'Gómez Plata'], # Guadalupe excluded
    8: ['Carolina'], # Angostura excluded
    9: ['San José de la Montaña'], # Toledo excluded
    10: ['Santa Rosa de Osos', 'Carolina', 'Gómez Plata'],
    11: ['Entrerríos', 'San José de la Montaña', 'Santa Rosa de Osos', 'Belmira'],
    12: ['Ebéjico', 'Heliconia', 'Giraldo'], # Medellín excluded
    13: ['Sopetrán', 'Belmira'], # San Jerónimo excluded
    14: ['Frontino', 'Abriaquí', 'Cañasgordas', 'Giraldo'],
    15: ['Sonsón', 'Argelia', 'Granada'], # Nariño excluded
    16: ['San Vicente', 'El Peñol', 'Concepción'],
    17: ['Abejorral', 'La Unión'], # La Ceja excluded
    18: ['Abejorral', 'Santa Bárbara', 'Montebello'],
    19: ['Sonsón'],
    20: ['Titiribí', 'Armenia', 'Amagá', 'Angelópolis'],
    21: ['Salgar', 'Concordia', 'Betulia'],
    22: ['Valparaíso', 'Támesis'], # La Pintada excluded
    23: ['Andes', 'Pueblorrico'], # Jericó excluded
    24: ['Mutatá'], # Chigorodó excluded
    25: ['San Pedro de Urabá', 'Necoclí'],
    26: ['San Pedro de Urabá', 'Arboletes'],
    27: ['San Pedro de Urabá', 'Turbo'], # Apartadó excluded
    28: ['Ebéjico', 'Giraldo'], # San Jerónimo excluded
    29: ['Guarne', 'San Vicente']
}

# Standardize municipality names in GeoJSON
valid_mpio_names = {}
for f in mun_geojson['features']:
    m_name = f['properties'].get('MPIO_NOMBR', '').strip().title()
    valid_mpio_names[m_name.upper()] = m_name

mpio_synonyms = {
    'CAROLINA DEL PRÍNCIPE': 'Carolina',
    'CAROLINA DEL PRINCIPE': 'Carolina',
    'CAROLINA': 'Carolina',
    'PUERTO BERRÍO': 'Puerto Berrio',
    'PUERTO BERRIO': 'Puerto Berrio',
    'SAN JOSÉ DE LA MONTAÑA': 'San José De La Montaña',
    'SAN PEDRO DE URABÁ': 'San Pedro De Urabá',
    'SANTA BÁRBARA': 'Santa Bárbara',
    'SANTA ROSA DE OSOS': 'Santa Rosa De Osos',
    'EL PEÑOL': 'El Peñol',
    'LA UNIÓN': 'La Unión'
}

def clean_mpio_name(raw_name):
    if raw_name.upper() in mpio_synonyms:
        return mpio_synonyms[raw_name.upper()]
    if raw_name.upper() in valid_mpio_names:
        return valid_mpio_names[raw_name.upper()]
    for k, v in valid_mpio_names.items():
        k_clean = re.sub(r'[ÁÉÍÓÚ]', lambda m: {'Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'}[m.group()], k)
        raw_clean = re.sub(r'[ÁÉÍÓÚáéíóú]', lambda m: {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'}[m.group()], raw_name.upper())
        if k_clean == raw_clean:
            return v
    return raw_name

# Parse Municipalities
municipalities = []
for f in mun_geojson['features']:
    props = f['properties']
    raw_sub = props.get('SUBREGION', '').strip().upper()
    norm_sub = subregion_map.get(raw_sub, raw_sub.title())
    mpio_name = props.get('MPIO_NOMBR', '').strip().title()
    mpio_code = str(props.get('COD_MPIO', '')).strip()
    
    municipalities.append({
        'code': mpio_code,
        'name': mpio_name,
        'subregion': norm_sub,
        'zona': props.get('ZONA', ''),
        'area_km2': round(float(props.get('Shape__Are', 0)) / 1e6, 2),
        'perimeter_km': round(float(props.get('Shape__Len', 0)) / 1e3, 2)
    })

# Parse Circuits
sub_cols = ['NORDESTE', 'ORIENTE', 'SUROESTE', 'OCCIDENTE', 'NORTE', 'BAJO CAUCA', 'MAGDALENA MEDIO', 'URABA', 'AREA METROPOLITANA']

circuits = []
for idx, r in df.iterrows():
    cid = int(r['ID'])
    cname = str(r['CIRCUITO']).strip()
    is_multi = str(r['VARIAS SUBREGIONES']).strip().lower() == 'si'
    
    breakdown = {}
    for col in sub_cols:
        val = r[col]
        if pd.notna(val) and float(val) > 0:
            norm_col = subregion_map.get(col, col.title())
            breakdown[norm_col] = round(float(val), 2)
    
    raw_s = str(r['SUBREGION']).strip()
    if '-' in raw_s:
        parts = [subregion_map.get(p.strip().upper(), p.strip().title()) for p in raw_s.split('-')]
        primary_sub = ' - '.join(parts)
    else:
        primary_sub = subregion_map.get(raw_s.upper(), raw_s.title())
    
    raw_mpios = circuit_to_mpios_verified.get(cid, [])
    # Filter out excluded municipalities strictly
    mpios = []
    for m in raw_mpios:
        c_m = clean_mpio_name(m)
        if c_m.upper() not in EXCLUDED_MPIOS and m.upper() not in EXCLUDED_MPIOS:
            mpios.append(c_m)
    mpios = sorted(list(set(mpios)))
    
    circuits.append({
        'id': cid,
        'codigo': f"CIR-{cid:02d}",
        'name': cname,
        'subregion': primary_sub,
        'is_multi_subregion': is_multi,
        'km_intervenir': round(float(r['LONG_INTERVENIR']), 2),
        'total_corredor_km': round(float(r['TOTAL_CORREDOR']), 2),
        'subregion_breakdown': breakdown,
        'municipios': mpios,
        'estado': 'Priorizado para Estabilización'
    })

# Compute Subregion Aggregations
subregion_summary = {}
for s_name in ['Norte', 'Urabá', 'Oriente', 'Occidente', 'Suroeste', 'Magdalena Medio', 'Nordeste', 'Bajo Cauca', 'Valle de Aburrá']:
    subregion_summary[s_name] = {
        'name': s_name,
        'color': '#095642',
        'km_total': 0.0,
        'circuitos_count': 0,
        'circuitos_ids': [],
        'municipios': [m['name'] for m in municipalities if m['subregion'] == s_name],
        'municipios_count': len([m for m in municipalities if m['subregion'] == s_name]),
        'municipios_intervenidos': set()
    }

for c in circuits:
    for s_name, km in c['subregion_breakdown'].items():
        if s_name in subregion_summary:
            subregion_summary[s_name]['km_total'] += km
            if c['id'] not in subregion_summary[s_name]['circuitos_ids']:
                subregion_summary[s_name]['circuitos_ids'].append(c['id'])
                subregion_summary[s_name]['circuitos_count'] += 1
            for m in c['municipios']:
                for m_obj in municipalities:
                    if m_obj['name'] == m and m_obj['subregion'] == s_name:
                        subregion_summary[s_name]['municipios_intervenidos'].add(m)

summary_list = []
total_km_all = sum(c['km_intervenir'] for c in circuits)
all_intervened_mpios = set()
for c in circuits:
    all_intervened_mpios.update(c['municipios'])

for s_name, s_data in subregion_summary.items():
    km_rounded = round(s_data['km_total'], 2)
    s_data['km_total'] = km_rounded
    s_data['pct_total'] = round((km_rounded / total_km_all) * 100, 2) if total_km_all > 0 else 0
    s_data['municipios_intervenidos'] = sorted(list(s_data['municipios_intervenidos']))
    s_data['municipios_intervenidos_count'] = len(s_data['municipios_intervenidos'])
    summary_list.append(s_data)

summary_list.sort(key=lambda x: -x['km_total'])

output_dataset = {
    'metadata': {
        'title': 'Centro de Control Territorial - Red Vial Secundaria',
        'institution': 'Gobernación de Antioquia',
        'version': '1.0.2',
        'generated_date': '2026-08-14',
        'total_km': round(total_km_all, 2),
        'total_circuitos': len(circuits),
        'total_subregiones': len([s for s in summary_list if s['km_total'] > 0]),
        'total_municipios_antioquia': len(municipalities),
        'total_municipios_intervenidos': len(all_intervened_mpios),
        'cobertura_mpios_pct': round((len(all_intervened_mpios) / len(municipalities)) * 100, 1)
    },
    'subregiones': summary_list,
    'circuitos': circuits,
    'municipios': municipalities
}

with open('Data/data_normalized.json', 'w', encoding='utf-8') as f:
    json.dump(output_dataset, f, ensure_ascii=False, indent=2)

print("data_normalized.json updated!")

# Rebuild Municipios_opt.geojson
opt_mun_features = []
for f in mun_geojson['features']:
    props = f['properties']
    raw_sub = props.get('SUBREGION', '').strip().upper()
    norm_sub = subregion_map.get(raw_sub, raw_sub.title())
    mpio_name = props.get('MPIO_NOMBR', '').strip().title()
    mpio_code = str(props.get('COD_MPIO', '')).strip()
    
    # Check if municipality is in excluded list
    is_excluded = mpio_name.upper() in EXCLUDED_MPIOS
    
    # Find circuits related to this municipality
    mpio_circuits = [] if is_excluded else [c for c in circuits if mpio_name in c['municipios']]
    
    clean_props = {
        'code': mpio_code,
        'name': mpio_name,
        'subregion': norm_sub,
        'zona': props.get('ZONA', ''),
        'circuits_count': len(mpio_circuits),
        'circuits_ids': [c['id'] for c in mpio_circuits],
        'circuits_names': [c['name'] for c in mpio_circuits],
        'km_intervencion': round(sum(c['km_intervenir'] for c in mpio_circuits), 2)
    }
    
    opt_mun_features.append({
        'type': 'Feature',
        'properties': clean_props,
        'geometry': f['geometry']
    })

with open('Data/Municipios_opt.geojson', 'w', encoding='utf-8') as f:
    json.dump({'type': 'FeatureCollection', 'features': opt_mun_features}, f, ensure_ascii=False)

print("Municipios_opt.geojson updated!")

# Rebuild PDF Geodata
import generate_pdf_geodata

print("\n--- CHECKING ALL 12 EXCLUDED MUNICIPALITIES ---")
with open('Data/Municipios_opt.geojson', 'r', encoding='utf-8') as f:
    test_mun = json.load(f)

for feat in test_mun['features']:
    name = feat['properties']['name']
    if name.upper() in EXCLUDED_MPIOS:
        p = feat['properties']
        print(f"EXCLUDED VERIFICATION -> {name}: circuits_count={p['circuits_count']}, km={p['km_intervencion']}")

print("\n--- CHECKING INCLUDED MUNICIPALITIES ---")
for feat in test_mun['features']:
    name = feat['properties']['name']
    if name in ['Giraldo', 'Cáceres', 'Santa Rosa De Osos', 'Sonsón', 'San Pedro De Urabá']:
        p = feat['properties']
        print(f"INCLUDED VERIFICATION -> {name}: circuits_count={p['circuits_count']}, km={p['km_intervencion']}")
