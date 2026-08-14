import pandas as pd
import json
import re
import unicodedata

def normalize_str(s):
    if not s or pd.isna(s):
        return ""
    s = str(s).strip()
    return unicodedata.normalize('NFKD', s)

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

# Subregions metadata and official colors
subregions_meta = {
    'Norte': {'code': 'NOR', 'color': '#1E7E34', 'description': 'Subregión Norte de Antioquia'},
    'Urabá': {'code': 'URA', 'color': '#00838F', 'description': 'Subregión de Urabá'},
    'Oriente': {'code': 'ORI', 'color': '#2E7D32', 'description': 'Subregión Oriente Antioqueño'},
    'Occidente': {'code': 'OCC', 'color': '#37474F', 'description': 'Subregión Occidente de Antioquia'},
    'Suroeste': {'code': 'SUR', 'color': '#4E342E', 'description': 'Subregión Suroeste de Antioquia'},
    'Magdalena Medio': {'code': 'MAG', 'color': '#0277BD', 'description': 'Subregión Magdalena Medio'},
    'Nordeste': {'code': 'NDE', 'color': '#E65100', 'description': 'Subregión Nordeste de Antioquia'},
    'Bajo Cauca': {'code': 'BCA', 'color': '#F57F17', 'description': 'Subregión Bajo Cauca'},
    'Valle de Aburrá': {'code': 'VAB', 'color': '#5C6BC0', 'description': 'Área Metropolitana del Valle de Aburrá'}
}

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

# Parse Circuits and match with municipalities and road segments
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
    
    # Primary subregion string
    raw_s = str(r['SUBREGION']).strip()
    if '-' in raw_s:
        parts = [subregion_map.get(p.strip().upper(), p.strip().title()) for p in raw_s.split('-')]
        primary_sub = ' - '.join(parts)
    else:
        primary_sub = subregion_map.get(raw_s.upper(), raw_s.title())
    
    # Identify municipalities referenced in circuit name
    c_mpios = []
    for m in municipalities:
        m_name_clean = re.sub(r'[áéíóúÁÉÍÓÚ]', lambda m: {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'}[m.group()], m['name']).lower()
        c_name_clean = re.sub(r'[áéíóúÁÉÍÓÚ]', lambda m: {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'}[m.group()], cname).lower()
        
        # Exact word match for municipality
        pattern = r'\b' + re.escape(m_name_clean) + r'\b'
        if re.search(pattern, c_name_clean):
            if m['name'] not in c_mpios:
                c_mpios.append(m['name'])
    
    # Specific known municipality mappings for circuits if name differs slightly
    special_mpios = {
        1: ['Cáceres', 'Caucasia'],
        2: ['Yondó', 'Puerto Berrío'],
        3: ['San Roque', 'Caracolí', 'Santo Domingo'],
        4: ['San Rafael', 'San Roque', 'Santo Domingo', 'Alejandría'],
        5: ['Amalfi', 'Anorí'],
        6: ['Remedios', 'Puerto Berrío'],
        7: ['Guadalupe', 'Carolina del Príncipe', 'Gómez Plata'],
        8: ['Carolina del Príncipe', 'Angostura'],
        9: ['Toledo', 'San José de la Montaña'],
        10: ['Santa Rosa de Osos', 'Carolina del Príncipe', 'Gómez Plata'],
        11: ['Entrerríos', 'San José de la Montaña', 'Santa Rosa de Osos'],
        12: ['Ebéjico', 'Heliconia', 'Medellín'],
        13: ['Sopetrán', 'Belmira', 'San Jerónimo'],
        14: ['Frontino', 'Abriaquí'],
        15: ['Sonsón', 'Argelia', 'Nariño'],
        16: ['San Vicente', 'El Peñol', 'Guarne'],
        17: ['Abejorral', 'La Ceja'],
        18: ['Abejorral', 'Santa Bárbara', 'Montebello'],
        19: ['Sonsón', 'Aguadas'],
        20: ['Titiribí', 'Armenia', 'Amagá'],
        21: ['Salgar', 'Concordia', 'Betulia'],
        22: ['Valparaíso', 'Támesis', 'La Pintada'],
        23: ['Andes', 'Pueblorrico', 'Jericó'],
        24: ['Mutatá', 'Chigorodó'],
        25: ['San Pedro de Urabá', 'Necoclí'],
        26: ['San Pedro de Urabá', 'Arboletes'],
        27: ['San Pedro de Urabá', 'Turbo', 'Apartadó'],
        28: ['Ebéjico', 'San Jerónimo'],
        29: ['Guarne', 'San Vicente']
    }
    
    combined_mpios = sorted(list(set(c_mpios + special_mpios.get(cid, []))))
    
    circuits.append({
        'id': cid,
        'codigo': f"CIR-{cid:02d}",
        'name': cname,
        'subregion': primary_sub,
        'is_multi_subregion': is_multi,
        'km_intervenir': round(float(r['LONG_INTERVENIR']), 2),
        'total_corredor_km': round(float(r['TOTAL_CORREDOR']), 2),
        'subregion_breakdown': breakdown,
        'municipios': combined_mpios,
        'estado': 'Priorizado para Estabilización'
    })

# Compute Subregion Aggregations
subregion_summary = {}
for s_name in subregions_meta.keys():
    subregion_summary[s_name] = {
        'name': s_name,
        'color': subregions_meta[s_name]['color'],
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
                # If municipality belongs to this subregion
                for m_obj in municipalities:
                    if m_obj['name'] == m and m_obj['subregion'] == s_name:
                        subregion_summary[s_name]['municipios_intervenidos'].add(m)

# Format summary list
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
        'version': '1.0.0',
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

print("SUCCESS: Data/data_normalized.json generated successfully!")
print(f"Total KM: {output_dataset['metadata']['total_km']}")
print(f"Total Circuitos: {output_dataset['metadata']['total_circuitos']}")
print(f"Total Municipios con intervención: {output_dataset['metadata']['total_municipios_intervenidos']} de {output_dataset['metadata']['total_municipios_antioquia']} ({output_dataset['metadata']['cobertura_mpios_pct']}%)")
