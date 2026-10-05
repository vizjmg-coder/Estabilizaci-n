[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[xml]$kml = Get-Content -Raw -Encoding UTF8 'kmz_extracted/doc.kml'
$placemarks = $kml.SelectNodes("//*[local-name()='Placemark']")
Write-Host "Total placemarks: $($placemarks.Count)"

$folders = $kml.SelectNodes("//*[local-name()='Folder']")
Write-Host "Total folders: $($folders.Count)"
foreach ($f in $folders) {
    $name = $f.name
    $pCount = $f.SelectNodes("./*[local-name()='Placemark']").Count
    Write-Host "Folder: $name ($pCount placemarks)"
}

Write-Host "`nSample placemark names (first 20):"
$i = 0
foreach ($p in $placemarks) {
    if ($i++ -lt 20) {
        $pname = $p.name
        $geom = $p.SelectSingleNode(".//*[local-name()='LineString' or local-name()='Point' or local-name()='Polygon' or local-name()='MultiGeometry']")
        $geomType = if ($geom) { $geom.LocalName } else { "Unknown" }
        Write-Host " - $pname [$geomType]"
    }
}
