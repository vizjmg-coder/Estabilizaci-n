[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Creating comprehensive estabilizacion database..."

# Load raw extracted slides
$slides = Get-Content -Raw -Encoding UTF8 "full_slides_extracted.json" | ConvertFrom-Json

# Helper to parse money strings
function CleanMoney($s) {
    if (-not $s) { return 0 }
    $clean = $s -replace '[^\d]', ''
    if ($clean -eq '') { return 0 }
    return [int64]$clean
}

function CleanFloat($s) {
    if (-not $s) { return 0.0 }
    $clean = $s -replace '\s+', '' -replace '%', '' -replace '\+', '' -replace '▲', '' -replace '▼', '' -replace ',', '.'
    $val = 0.0
    [double]::TryParse($clean, [System.Globalization.NumberStyles]::Any, [System.Globalization.CultureInfo]::InvariantCulture, [ref]$val) | Out-Null
    return $val
}

# Create output folder
if (-not (Test-Path "data")) { New-Item -ItemType Directory -Path "data" | Out-Null }
if (-not (Test-Path "assets")) { New-Item -ItemType Directory -Path "assets" | Out-Null }

# Copy images to assets
Copy-Item "pptx_extracted/ppt/media/image1.png" "assets/logo_antioquia.png" -Force
Copy-Item "pptx_extracted/ppt/media/image2.png" "assets/hero_estabilizacion.png" -Force
Copy-Item "pptx_extracted/ppt/media/image3.png" "assets/escudo_antioquia.png" -Force

Write-Host "Assets copied."
