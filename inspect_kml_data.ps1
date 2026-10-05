[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[xml]$kml = Get-Content -Raw -Encoding UTF8 'kmz_extracted/doc.kml'
$placemarks = $kml.SelectNodes("//*[local-name()='Placemark']")

$allData = @()
foreach ($p in $placemarks) {
    $name = $p.name
    $sData = $p.SelectNodes(".//*[local-name()='SimpleData']")
    $props = @{ Name = $name }
    foreach ($sd in $sData) {
        $props[$sd.GetAttribute('name')] = $sd.InnerText
    }
    $allData += [PSCustomObject]$props
}

$allData | Format-Table -AutoSize | Out-String -Width 200 | Write-Host
$allData | ConvertTo-Json -Depth 3 | Set-Content -Encoding UTF8 "kml_corridors.json"
