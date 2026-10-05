[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$slides = Get-Content -Raw -Encoding UTF8 'full_slides_extracted.json' | ConvertFrom-Json

$execSlides = @(3, 5, 7, 10, 12, 14, 16, 19, 21, 23, 25, 28, 31, 33, 35, 38, 40, 42, 45, 48, 50)

$execData = @()

foreach ($sNum in $execSlides) {
    $s = $slides | Where-Object { $_.Slide -eq $sNum }
    $texts = $s.Shapes | ForEach-Object { $_.Text }
    
    $full = $texts -join " | "
    
    # Extract corridor title
    $title = $s.Title
    
    # Extract physical, financial, time progress
    $fisico = ""
    $financiero = ""
    $plazo = ""
    $fechas = ""
    $alcanceReal = ""
    
    if ($full -match 'Avance físico \| ([^|]+)') { $fisico = $matches[1].Trim() }
    if ($full -match 'Avance financiero \| ([^|]+)') { $financiero = $matches[1].Trim() }
    if ($full -match 'Plazo transcurrido \| ([^|]+)') { $plazo = $matches[1].Trim() }
    if ($full -match '(Inicio:[^|]+(?:\|[^|]+){1,5})') { $fechas = $matches[1].Trim() }
    if ($full -match 'Alcance real ([^|]+)') { $alcanceReal = $matches[1].Trim() }
    
    $tableData = @()
    if ($s.Tables.Count -gt 0) {
        $tableData = $s.Tables[0]
    }
    
    $execData += [PSCustomObject]@{
        Slide = $sNum
        Corredor = $title
        AlcanceReal = $alcanceReal
        AvanceFisico = $fisico
        AvanceFinanciero = $financiero
        PlazoTranscurrido = $plazo
        Fechas = $fechas
        ActivityTable = $tableData
    }
}

$execData | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 "extracted_execution_data.json"
Write-Host "Extracted $($execData.Count) execution slides."
