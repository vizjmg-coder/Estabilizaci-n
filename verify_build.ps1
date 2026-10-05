[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$files = @(
  'data/estabilizacion_data.js',
  'data/corredores_geo.js',
  'data/municipios_geo.js',
  'js/map.js',
  'js/pavement.js',
  'js/abscissas.js',
  'js/charts.js',
  'js/app.js',
  'css/styles.css',
  'index.html',
  'assets/logo_antioquia.png',
  'assets/hero_estabilizacion.png',
  'assets/escudo_antioquia.png'
)

$allOk = $true
foreach ($f in $files) {
  if (Test-Path $f) {
    Write-Host "[OK] $f ($((Get-Item $f).Length) bytes)"
  } else {
    Write-Host "[MISSING] $f"
    $allOk = $false
  }
}

if ($allOk) {
  Write-Host "`nAll dashboard assets and code files verified successfully!"
}
