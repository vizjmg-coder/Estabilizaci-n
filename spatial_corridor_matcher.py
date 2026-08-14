import json
import re

# Load raw GeoJSONs
with open('Data/Municipios.geojson', 'r', encoding='utf-8') as f:
    mun_data = json.load(f)

with open('Data/Secundaria.geojson', 'r', encoding='utf-8') as f:
    sec_data = json.load(f)

with open('Data/data_normalized.json', 'r', encoding='utf-8') as f:
    norm_data = json.load(f)

# Point in polygon algorithm
def point_in_poly(x, y, poly):
    n = len(poly)
    inside = False
    p1x, p1y = poly[0]
    for i in range(n + 1):
        p2x, p2y = poly[i % n]
        if y > min(p1y, p2y):
            if y <= max(p1y, p2y):
                if x <= max(p1x, p2x):
                    if p1y != p2y:
                        xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                    if p1x == p2x or x <= xinters:
                        inside = not inside
        p1x, p1y = p2x, p2y
    return inside

def geom_bbox(geom):
    min_x, min_y, max_x, max_y = 180, 90, -180, -90
    def scan(coords):
        nonlocal min_x, min_y, max_x, max_y
        if isinstance(coords[0], (int, float)):
            min_x = min(min_x, coords[0])
            min_y = min(min_y, coords[1])
            max_x = max(max_x, coords[0])
            max_y = max(max_y, coords[1])
        else:
            for c in coords: scan(c)
    scan(geom['coordinates'])
    return (min_x, min_y, max_x, max_y)

def bboxes_overlap(b1, b2):
    return not (b1[2] < b2[0] or b1[0] > b2[2] or b1[3] < b2[1] or b1[1] > b2[3])

def line_intersects_poly(line_coords, poly_geom):
    p_type = poly_geom['type']
    p_coords = poly_geom['coordinates']
    
    # Sample points on line (start, middle, end, plus 5 samples)
    pts = []
    if len(line_coords) <= 5:
        pts = line_coords
    else:
        step = max(1, len(line_coords) // 6)
        pts = [line_coords[i] for i in range(0, len(line_coords), step)] + [line_coords[-1]]
    
    for pt in pts:
        x, y = pt[0], pt[1]
        if p_type == 'Polygon':
            if point_in_poly(x, y, p_coords[0]):
                return True
        elif p_type == 'MultiPolygon':
            for poly in p_coords:
                if point_in_poly(x, y, poly[0]):
                    return True
    return False

# Build spatial index of municipalities
mun_spatial = []
for f in mun_data['features']:
    p = f['properties']
    name = p.get('MPIO_NOMBR', '').strip().title()
    sub = p.get('SUBREGION', '').strip().title()
    bbox = geom_bbox(f['geometry'])
    mun_spatial.append({
        'name': name,
        'subregion': sub,
        'bbox': bbox,
        'geometry': f['geometry'],
        'feature': f
    })

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
    '62AN12': 12,    # La Miserenga - Ebéjico - Heliconia - Alto del Chuscal / Manglar - Giraldo
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
    '60AN12': 29     # Guarne - San Vicente
}

# Find all municipalities touched by prioritized roads
circuit_mpios_map = {i: set() for i in range(1, 30)}
mpio_impact_map = {m['name']: set() for m in mun_spatial}

for f in sec_data['features']:
    props = f['properties']
    cod = str(props.get('CODIGO_VIA', '')).strip()
    cid = road_to_circuit.get(cod)
    if not cid:
        continue
    
    r_geom = f['geometry']
    r_bbox = geom_bbox(r_geom)
    
    # Test intersection with all candidate municipalities
    lines = [r_geom['coordinates']] if r_geom['type'] == 'LineString' else r_geom['coordinates']
    for line in lines:
        for mun in mun_spatial:
            if not bboxes_overlap(r_bbox, mun['bbox']):
                continue
            if line_intersects_poly(line, mun['geometry']):
                circuit_mpios_map[cid].add(mun['name'])
                mpio_impact_map[mun['name']].add(cid)

print("\n--- RESULTS OF SPATIAL ANALYSIS ---")
print("Is MEDELLÍN impacted?:", len(mpio_impact_map.get('Medellín', [])) > 0, "Circuits:", mpio_impact_map.get('Medellín', []))
print("Is GIRALDO impacted?:", len(mpio_impact_map.get('Giraldo', [])) > 0, "Circuits:", mpio_impact_map.get('Giraldo', []))

impacted_mpios = [m for m, cids in mpio_impact_map.items() if len(cids) > 0]
non_impacted_mpios = [m for m, cids in mpio_impact_map.items() if len(cids) == 0]

print(f"\nTotal Impacted Municipalities: {len(impacted_mpios)} of {len(mun_spatial)}")
print("Impacted Municipalities:", sorted(impacted_mpios))
print(f"\nTotal Non-Impacted Municipalities: {len(non_impacted_mpios)}")
print("Non-Impacted Municipalities:", sorted(non_impacted_mpios))
