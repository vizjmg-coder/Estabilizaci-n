[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$slides = Get-Content -Raw -Encoding UTF8 'full_slides_extracted.json' | ConvertFrom-Json

$consolSlides = @(8, 17, 26, 29, 36, 43, 46, 51, 52)

foreach ($sNum in $consolSlides) {
    $s = $slides | Where-Object { $_.Slide -eq $sNum }
    Write-Host "`n======================================================="
    Write-Host "SLIDE $($s.Slide): $($s.Header)"
    Write-Host "======================================================="
    if ($s.Tables.Count -gt 0) {
        foreach ($row in $s.Tables[0]) {
            Write-Host ($row -join " | ")
        }
    }
}
