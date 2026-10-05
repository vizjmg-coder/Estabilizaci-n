[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$fullSlides = Get-Content -Raw -Encoding UTF8 'full_slides_extracted.json' | ConvertFrom-Json

Write-Host "Building master database from slides..."

# Let's inspect variation slides to extract pavement structure details
$variationSlides = @(2, 4, 6, 9, 11, 13, 15, 18, 20, 22, 24, 27, 30, 32, 34, 37, 39, 41, 44, 47, 49)

$pavementData = @{}
foreach ($vNum in $variationSlides) {
    $s = $fullSlides | Where-Object { $_.Slide -eq $vNum }
    $texts = $s.Shapes | ForEach-Object { $_.Text }
    $title = $s.Title
    $table = if ($s.Tables.Count -gt 0) { $s.Tables[0] } else { @() }
    
    # Extract notes
    $notes = ""
    $fullJoined = $texts -join " || "
    if ($fullJoined -match 'Notas:\s*([^|]+)') {
        $notes = $matches[1].Trim()
    }
    
    # Extract traffic
    $transitoEstruct = ""
    $transitoDiseno = ""
    if ($fullJoined -match 'Tránsito – Estructuración:\s*([\d\.]+)') { $transitoEstruct = $matches[1] }
    if ($fullJoined -match 'Tránsito – Diseño:\s*([\d\.]+)') { $transitoDiseno = $matches[1] }
    
    $key = "$vNum"
    $pavementData[$key] = @{
        Slide = $vNum
        Title = $title
        Notes = $notes
        TransitoEstructuracion = $transitoEstruct
        TransitoDiseno = $transitoDiseno
        Table = $table
        AllTexts = $texts
    }
}

$pavementData | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 "extracted_variation_data.json"
Write-Host "Saved extracted_variation_data.json"
