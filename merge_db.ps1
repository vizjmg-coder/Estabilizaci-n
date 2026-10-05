[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$base = Get-Content -Raw -Encoding UTF8 'data/estabilizacion_base.js'
$corr = Get-Content -Raw -Encoding UTF8 'data/estabilizacion_corredores.js'

$combined = $base + "`n`n" + $corr + "`n`nwindow.EST_DATA.corredores = window.EST_CORREDORES;`n"
$combined | Set-Content -Encoding UTF8 'data/estabilizacion_data.js'
Write-Host "Created unified data/estabilizacion_data.js: $((Get-Item 'data/estabilizacion_data.js').Length) bytes"
