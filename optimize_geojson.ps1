[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Optimizing corredores.geojson..."
$corrJson = Get-Content -Raw -Encoding UTF8 "corredores.geojson" | ConvertFrom-Json

function RoundCoord($val) {
    return [Math]::Round([double]$val, 5)
}

function SimplifyLine($pts, $minDistSq) {
    if ($pts.Count -le 2) { return $pts }
    $result = @($pts[0])
    $last = $pts[0]
    for ($i = 1; $i -lt $pts.Count - 1; $i++) {
        $curr = $pts[$i]
        $dx = [double]$curr[0] - [double]$last[0]
        $dy = [double]$curr[1] - [double]$last[1]
        $distSq = ($dx * $dx) + ($dy * $dy)
        # 0.0000005 deg^2 ~ approx 5-10 meters
        if ($distSq -ge $minDistSq) {
            $result += ,$curr
            $last = $curr
        }
    }
    $result += ,$pts[$pts.Count - 1]
    return $result
}

$optFeatures = @()
foreach ($f in $corrJson.features) {
    $geom = $f.geometry
    $newGeom = @{ type = $geom.type }
    if ($geom.type -eq "LineString") {
        $rounded = @()
        foreach ($pt in $geom.coordinates) {
            $rounded += ,@( (RoundCoord $pt[0]), (RoundCoord $pt[1]) )
        }
        $simplified = SimplifyLine $rounded 0.0000005
        $newGeom["coordinates"] = $simplified
    } elseif ($geom.type -eq "MultiLineString") {
        $multiLines = @()
        foreach ($line in $geom.coordinates) {
            $rounded = @()
            foreach ($pt in $line) {
                $rounded += ,@( (RoundCoord $pt[0]), (RoundCoord $pt[1]) )
            }
            $simplified = SimplifyLine $rounded 0.0000005
            if ($simplified.Count -ge 2) {
                $multiLines += ,$simplified
            }
        }
        $newGeom["coordinates"] = $multiLines
    }
    
    $optFeatures += @{
        type = "Feature"
        properties = $f.properties
        geometry = $newGeom
    }
}

$optCorrFC = @{
    type = "FeatureCollection"
    features = $optFeatures
}

$optCorrFC | ConvertTo-Json -Depth 8 -Compress | Set-Content -Encoding UTF8 "corredores_opt.geojson"
Write-Host "Done corredores. Size before: $((Get-Item 'corredores.geojson').Length) bytes, after: $((Get-Item 'corredores_opt.geojson').Length) bytes."

# Now optimize Municipios.geojson
Write-Host "Optimizing Municipios.geojson..."
$muniJson = Get-Content -Raw -Encoding UTF8 "Mapa/Municipios.geojson" | ConvertFrom-Json

function RoundMuniCoord($val) {
    return [Math]::Round([double]$val, 4)
}

$optMuniFeatures = @()
foreach ($f in $muniJson.features) {
    $props = @{
        cod = $f.properties.COD_MPIO
        nombre = $f.properties.MPIO_NOMBR
        subregion = $f.properties.SUBREGION
        zona = $f.properties.ZONA
    }
    
    $geom = $f.geometry
    $newGeom = @{ type = $geom.type }
    
    if ($geom.type -eq "Polygon") {
        $rings = @()
        foreach ($ring in $geom.coordinates) {
            $rounded = @()
            foreach ($pt in $ring) {
                $rounded += ,@( (RoundMuniCoord $pt[0]), (RoundMuniCoord $pt[1]) )
            }
            $simplified = SimplifyLine $rounded 0.000001
            if ($simplified.Count -ge 3) {
                $rings += ,$simplified
            }
        }
        $newGeom["coordinates"] = $rings
    } elseif ($geom.type -eq "MultiPolygon") {
        $polyList = @()
        foreach ($poly in $geom.coordinates) {
            $rings = @()
            foreach ($ring in $poly) {
                $rounded = @()
                foreach ($pt in $ring) {
                    $rounded += ,@( (RoundMuniCoord $pt[0]), (RoundMuniCoord $pt[1]) )
                }
                $simplified = SimplifyLine $rounded 0.000001
                if ($simplified.Count -ge 3) {
                    $rings += ,$simplified
                }
            }
            if ($rings.Count -gt 0) {
                $polyList += ,$rings
            }
        }
        $newGeom["coordinates"] = $polyList
    }
    
    $optMuniFeatures += @{
        type = "Feature"
        properties = $props
        geometry = $newGeom
    }
}

$optMuniFC = @{
    type = "FeatureCollection"
    features = $optMuniFeatures
}

$optMuniFC | ConvertTo-Json -Depth 8 -Compress | Set-Content -Encoding UTF8 "municipios_opt.geojson"
Write-Host "Done Municipios. Size before: $((Get-Item 'Mapa/Municipios.geojson').Length) bytes, after: $((Get-Item 'municipios_opt.geojson').Length) bytes."
