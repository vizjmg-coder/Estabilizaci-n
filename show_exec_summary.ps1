[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$data = Get-Content -Raw -Encoding UTF8 'extracted_execution_data.json' | ConvertFrom-Json
foreach ($d in $data) {
    Write-Host "Slide $($d.Slide) - $($d.Corredor): Físico: $($d.AvanceFisico) | Financiero: $($d.AvanceFinanciero) | Plazo: $($d.PlazoTranscurrido) | Alcance: $($d.AlcanceReal)"
}
