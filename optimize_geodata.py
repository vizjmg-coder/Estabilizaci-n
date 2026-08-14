import json
import re

# Load raw GeoJSONs
with open('Data/Municipios.geojson', 'r', encoding='utf-8') as f:
    mun_data = json.load(f)

with open('Data/Secundaria.geojson', 'r', encoding='utf-8') as f:
    sec_data = json.load(f)

with open('Data/data_normalized.json', 'r', encoding='utf-8') as f:
    norm_data = json.load(f)

circuits = norm_data['circuitos']

# Road matching map
road_to_circuit = {
    '25AN15-1': 1,   # Cáceres - La Chilona
    '62AN29-1': 2,   # La Ye - Yondo
    '62AN25': 3,     # Caramanta - San Roque
    '62AN22-2': 4,   # Santo Domingo - Alejandria
    '62AN22-2-1': 4, # Alejandría - El Bizcocho (San Rafael)
    '62AN22-1': 4,   # Santo Domingo - San Roque
    '62AN21-2-1': 5, # El Mango - Amalfi
    '62AN21-4-1': 5, # Chorritos - Santa Isabel
    '62AN30': 6,     # Puerto Berrío (Las Flores) - Cruces
    '62AN29-1-1': 6, # La Ye - Remedios
    '62AN21-1-2': 7, # El Guayabo - El Salto - Partidas a Guadalupe
    '25AN07': 8,     # Carolina del Príncipe - Angostura
    '25AN11-2': 9,   # Alto del Cardal - Toledo
    '25AN08': 10,    # Santa Rosas de Osos (Ruta 25) - Puente Gavino
    '62AN18-3': 11,  # Entrerríos - Te a Labores - La Apartada - San José de La Montaña
    '62AN12': 12,    # La Miserenga - Ebéjico - Heliconia - Alto del Chuscal
    '62AN15': 13,    # Sopetrán - Belmira
    '62AN10': 14,    # Frontino - Nutibara
    '62AN10-2': 14,  # Frontino - Abriaquí
    '56AN10-1': 15,  # La Quiebra - Argelia
    '60AN14-1': 16,  # San Vicente - El Peñol
    '56AN07': 17,    # La Frontera (Ruta 56) - Abejorral
    '56AN05-2': 18,  # Abejorral - El Cairo - La Elvira (Sta. Bárbara)
    '56AN09': 19,    # Sonsón - Puente San Rafael
    '60AN08-1': 20,  # Alto del Chuscal - Armenia - Titiribí
    '60AN05-1': 21,  # Salgar - La Quiebra
    '60AN06-1': 21,  # Concordia- La Quiebra - Betulia
    '25AN01-2': 22,  # Valparaíso - Tamesis
    '60AN04-1': 23,  # Pueblorrico - Ye a La Bodega (Andes)
    '62AN06': 24,    # Mutatá - Pavarando Grande
    '90AN01': 25,    # El Bobal - San Pedro de Urabá
    '62AN02-2': 25,  # San Pedro de Urabá - El Tambito
    '90AN03': 26,    # Arboletes - El Tambito
    '62AN02': 27,    # El Tres - San Pedro de Urabá
    '62AN12': 28,    # Ebéjico - Miserenga
    '60AN12': 29     # Guarne - San Vicente
}

# Simplify coords function (round to 5 decimals)
def round_coords(coords):
    if isinstance(coords[0], (int, float)):
        return [round(coords[0], 5), round(coords[1], 5)]
    return [round_coords(c) for c in coords]

# Optimize Municipios GeoJSON
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

opt_mun_features = []
for f in mun_data['features']:
    props = f['properties']
    raw_sub = props.get('SUBREGION', '').strip().upper()
    norm_sub = subregion_map.get(raw_sub, raw_sub.title())
    mpio_name = props.get('MPIO_NOMBR', '').strip().title()
    mpio_code = str(props.get('COD_MPIO', '')).strip()
    
    # Find circuits related to this municipality
    mpio_circuits = [c for c in circuits if mpio_name in c['municipios']]
    
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
        'geometry': {
            'type': f['geometry']['type'],
            'coordinates': round_coords(f['geometry']['coordinates'])
        }
    })

opt_mun_geojson = {
    'type': 'FeatureCollection',
    'features': opt_mun_features
}

with open('Data/Municipios_opt.geojson', 'w', encoding='utf-8') as f:
    json.dump(opt_mun_geojson, f, ensure_ascii=False)

# Optimize Secundaria GeoJSON with circuit links
opt_sec_features = []
for f in sec_data['features']:
    props = f['properties']
    cod = str(props.get('CODIGO_VIA', '')).strip()
    nom = str(props.get('NOMBRE_VIA', '')).strip()
    cid = road_to_circuit.get(cod)
    
    # If not in exact map, try heuristic match
    if not cid:
        for c in circuits:
            c_name_clean = c['name'].lower()
            nom_clean = nom.lower()
            tokens = [t.strip() for t in re.split(r'[-–/]', c_name_clean) if len(t.strip()) > 3]
            if len(tokens) >= 2 and all(tok in nom_clean for tok in tokens[:2]):
                cid = c['id']
                break
    
    circuit_info = next((c for c in circuits if c['id'] == cid), None) if cid else None
    
    clean_props = {
        'codigo': cod,
        'nombre': nom,
        'inicio': props.get('INICIO'),
        'fin': props.get('FIN'),
        'longitud_km': props.get('L_ODOMETRO') or props.get('L_GPS') or 0,
        'ancho_m': props.get('ANCHO_VIA') or 0,
        'is_prioritized': cid is not None,
        'circuit_id': cid,
        'circuit_name': circuit_info['name'] if circuit_info else None,
        'subregion': circuit_info['subregion'] if circuit_info else None,
        'km_intervenir': circuit_info['km_intervenir'] if circuit_info else 0
    }
    
    opt_sec_features.append({
        'type': 'Feature',
        'properties': clean_props,
        'geometry': {
            'type': f['geometry']['type'],
            'coordinates': round_coords(f['geometry']['coordinates'])
        }
    })

opt_sec_geojson = {
    'type': 'FeatureCollection',
    'features': opt_sec_features
}

with open('Data/Secundaria_opt.geojson', 'w', encoding='utf-8') as f:
    json.dump(opt_sec_geojson, f, ensure_ascii=False)

print("Optimized GeoJSONs generated successfully:")
print(f"  - Municipios_opt.geojson: {len(opt_mun_features)} features")
print(f"  - Secundaria_opt.geojson: {len(opt_sec_features)} features ({len([f for f in opt_sec_features if f['properties']['is_prioritized']])} prioritized interventions)")
