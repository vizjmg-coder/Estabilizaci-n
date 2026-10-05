[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

[xml]$kml = Get-Content -Raw -Encoding UTF8 'kmz_extracted/doc.kml'
$placemarks = $kml.SelectNodes("//*[local-name()='Placemark']")

$features = @()

foreach ($p in $placemarks) {
    $name = $p.name
    $desc = $p.description
    
    # Parse attributes from description HTML
    $id = ""
    $circuito = ""
    $subregion = ""
    $longKm = 0
    
    if ($desc -match "<td>ID</td>\s*<td>([^<]+)</td>") { $id = $matches[1].Trim() }
    if ($desc -match "<td>CIRCUITO</td>\s*<td>([^<]+)</td>") { $circuito = $matches[1].Trim() }
    if ($desc -match "<td>SUBREGION</td>\s*<td>([^<]+)</td>") { $subregion = $matches[1].Trim() }
    if ($desc -match "<td>LONG_INTERVENIR_KM</td>\s*<td>([^<]+)</td>") { 
        $val = $matches[1].Trim().Replace(',', '.')
        [double]::TryParse($val, [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$longKm) | Out-Null
    }
    
    # Parse coordinates: can be LineString, MultiGeometry containing LineStrings, etc.
    $coordNodes = $p.SelectNodes(".//*[local-name()='coordinates']")
    $lines = @()
    
    foreach ($cn in $coordNodes) {
        $cText = $cn.InnerText.Trim()
        $pts = $cText -split '\s+'
        $linePts = @()
        foreach ($pt in $pts) {
            $parts = $pt -split ','
            if ($parts.Count -ge 2) {
                $lon = 0.0
                $lat = 0.0
                if ([double]::TryParse($parts[0], [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$lon) -and
                    [double]::TryParse($parts[1], [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$lat)) {
                    $linePts += ,@($lon, $lat)
                }
            }
        }
        if ($linePts.Count -gt 1) {
            $lines += ,$linePts
        }
    }
    
    $geom = $null
    if ($lines.Count -eq 1) {
        $geom = @{
            type = "LineString"
            coordinates = $lines[0]
        }
    } elseif ($lines.Count -gt 1) {
        $geom = @{
            type = "MultiLineString"
            coordinates = $lines
        }
    }
    
    if ($geom -ne $null) {
        $features += @{
            type = "Feature"
            properties = @{
                id = $id
                code = if ($name -match '^(E-\d+)') { $matches[1] } else { "E-$id" }
                name = $name
                circuito = if ($circuito -ne "") { $circuito } else { $name }
                subregion = $subregion
                long_km = $longKm
            }
            geometry = $geom
        }
    }
}

$fc = @{
    type = "FeatureCollection"
    features = $features
}

$fc | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 "corredores.geojson"
Write-Host "Exported $($features.Count) corridor features to corredores.geojson"
