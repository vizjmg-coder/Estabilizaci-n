import json
import math

# Load existing geojson
with open('Data/Municipios_opt.geojson', 'r', encoding='utf-8') as f:
    mun_data = json.load(f)

with open('Data/Secundaria_opt.geojson', 'r', encoding='utf-8') as f:
    sec_data = json.load(f)

# Douglas-Peucker simplification algorithm
def point_line_distance(point, start, end):
    if start == end:
        return math.hypot(point[0] - start[0], point[1] - start[1])
    n = abs((end[1] - start[1]) * point[0] - (end[0] - start[0]) * point[1] + end[0] * start[1] - end[1] * start[0])
    d = math.hypot(end[1] - start[1], end[0] - start[0])
    return n / d if d > 0 else 0

def douglas_peucker(points, tolerance):
    if len(points) <= 2:
        return points
    dmax = 0
    index = 0
    end = len(points) - 1
    for i in range(1, end):
        d = point_line_distance(points[i], points[0], points[end])
        if d > dmax:
            index = i
            dmax = d
    if dmax > tolerance:
        rec1 = douglas_peucker(points[:index + 1], tolerance)
        rec2 = douglas_peucker(points[index:], tolerance)
        return rec1[:-1] + rec2
    else:
        return [points[0], points[end]]

def simplify_ring(ring, tol=0.0025):
    if len(ring) <= 4:
        return ring
    simp = douglas_peucker(ring, tol)
    if len(simp) < 4:
        return ring[:4] # Minimum triangle + close
    # Ensure closed
    if simp[0] != simp[-1]:
        simp.append(simp[0])
    return simp

def simplify_geometry(geom, tol=0.0025):
    gtype = geom['type']
    coords = geom['coordinates']
    if gtype == 'Polygon':
        return {
            'type': 'Polygon',
            'coordinates': [simplify_ring(r, tol) for r in coords]
        }
    elif gtype == 'MultiPolygon':
        return {
            'type': 'MultiPolygon',
            'coordinates': [[simplify_ring(r, tol) for r in poly] for poly in coords]
        }
    elif gtype == 'LineString':
        simp = douglas_peucker(coords, tol)
        return {
            'type': 'LineString',
            'coordinates': simp if len(simp) >= 2 else coords
        }
    elif gtype == 'MultiLineString':
        return {
            'type': 'MultiLineString',
            'coordinates': [douglas_peucker(line, tol) for line in coords]
        }
    return geom

# Process Municipios
pdf_mun_features = []
total_pts_before = 0
total_pts_after = 0

for f in mun_data['features']:
    simp_geom = simplify_geometry(f['geometry'], tol=0.002) # ~200m tolerance
    
    # Count points
    def count_pts(c):
        if isinstance(c[0], (int, float)): return 1
        return sum(count_pts(sub) for sub in c)
    
    total_pts_before += count_pts(f['geometry']['coordinates'])
    total_pts_after += count_pts(simp_geom['coordinates'])
    
    pdf_mun_features.append({
        'type': 'Feature',
        'properties': f['properties'],
        'geometry': simp_geom
    })

pdf_mun_geojson = {
    'type': 'FeatureCollection',
    'features': pdf_mun_features
}

with open('Data/Municipios_pdf.geojson', 'w', encoding='utf-8') as f:
    json.dump(pdf_mun_geojson, f, ensure_ascii=False)

# Process Secundaria
pdf_sec_features = []
for f in sec_data['features']:
    simp_geom = simplify_geometry(f['geometry'], tol=0.001) # ~100m tolerance for roads
    pdf_sec_features.append({
        'type': 'Feature',
        'properties': f['properties'],
        'geometry': simp_geom
    })

pdf_sec_geojson = {
    'type': 'FeatureCollection',
    'features': pdf_sec_features
}

with open('Data/Secundaria_pdf.geojson', 'w', encoding='utf-8') as f:
    json.dump(pdf_sec_geojson, f, ensure_ascii=False)

print(f"Municipios points reduced from {total_pts_before} to {total_pts_after} ({(1 - total_pts_after/total_pts_before)*100:.1f}% reduction)!")
print("Saved Data/Municipios_pdf.geojson and Data/Secundaria_pdf.geojson successfully.")
