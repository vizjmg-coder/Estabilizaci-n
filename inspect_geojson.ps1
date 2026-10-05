[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$jsonText = Get-Content -Raw -Encoding UTF8 'Mapa/Municipios.geojson'
# Since file is 22MB, let's see how many features and sample properties
$geo = $jsonText | ConvertFrom-Json
Write-Host "Type: $($geo.type)"
Write-Host "Feature count: $($geo.features.Count)"
if ($geo.features.Count -gt 0) {
    Write-Host "Sample properties:"
    $geo.features[0].properties | Out-String | Write-Host
}
