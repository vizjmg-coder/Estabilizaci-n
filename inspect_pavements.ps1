[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$varData = Get-Content -Raw -Encoding UTF8 'extracted_variation_data.json' | ConvertFrom-Json

foreach ($prop in $varData.PSObject.Properties) {
    $item = $prop.Value
    Write-Host "`n=== Slide $($item.Slide) - $($item.Title) ==="
    $inPavement = $false
    $pavementLines = @()
    foreach ($t in $item.AllTexts) {
        if ($t -match "Teórica|Aprobada|TSD|MDC|BGTC|MGTC|Subbase|Subrasante|Afirmado|Espesor") {
            $pavementLines += $t
        }
    }
    Write-Host "Pavement elements: $($pavementLines -join ' | ')"
    if ($item.Notes -ne "") {
        Write-Host "Notes: $($item.Notes)"
    }
}
