[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$cGeo = Get-Content -Raw -Encoding UTF8 'corredores_opt.geojson'
$cJs = "window.GEO_CORREDORES = " + $cGeo + ";"
$cJs | Set-Content -Encoding UTF8 'data/corredores_geo.js'
Write-Host "Created data/corredores_geo.js: $((Get-Item 'data/corredores_geo.js').Length) bytes"

$mGeo = Get-Content -Raw -Encoding UTF8 'municipios_opt.geojson'
$mJs = "window.GEO_MUNICIPIOS = " + $mGeo + ";"
$mJs | Set-Content -Encoding UTF8 'data/municipios_geo.js'
Write-Host "Created data/municipios_geo.js: $((Get-Item 'data/municipios_geo.js').Length) bytes"
