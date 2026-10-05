[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$corrOpt = Get-Content -Raw -Encoding UTF8 "corredores_opt.geojson" | ConvertFrom-Json
Write-Host "KML Corridors count: $($corrOpt.features.Count)"
foreach ($f in $corrOpt.features) {
    Write-Host "$($f.properties.code) | $($f.properties.circuito) | $($f.properties.subregion) | $($f.properties.long_km) km"
}
