[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$corrPath = "$PSScriptRoot/data/estabilizacion_corredores.js"
$rawText = [System.IO.File]::ReadAllText($corrPath, [System.Text.Encoding]::UTF8)

# Strip "window.EST_CORREDORES = " and trailing ";"
$jsonText = $rawText.Trim()
if ($jsonText.StartsWith("window.EST_CORREDORES =")) {
    $jsonText = $jsonText.Substring("window.EST_CORREDORES =".Length).Trim()
}
if ($jsonText.EndsWith(";")) {
    $jsonText = $jsonText.Substring(0, $jsonText.Length - 1).Trim()
}

$corridors = $jsonText | ConvertFrom-Json

Write-Host "Read $($corridors.Count) corridors successfully."
