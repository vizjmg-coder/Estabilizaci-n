[xml]$k = Get-Content -Raw -Encoding UTF8 'kmz_extracted/doc.kml'
$node = $k.SelectSingleNode("//*[local-name()='Placemark']/*[local-name()='description']")
if ($node) {
    Write-Host $node.InnerText
} else {
    Write-Host "No description node found."
}
