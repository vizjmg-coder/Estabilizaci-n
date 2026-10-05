[xml]$kml = Get-Content -Raw -Encoding UTF8 'kmz_extracted/doc.kml'
$p1 = $kml.SelectSingleNode("//*[local-name()='Placemark']")
Write-Host "Placemark child elements:"
foreach ($ch in $p1.ChildNodes) {
    Write-Host " - $($ch.LocalName): $($ch.InnerText.Substring(0, [Math]::Min(100, $ch.InnerText.Length)))"
}
