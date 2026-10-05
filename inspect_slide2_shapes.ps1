[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[xml]$s2 = Get-Content -Raw -Encoding UTF8 'pptx_extracted/ppt/slides/slide2.xml'
$ns = New-Object System.Xml.XmlNamespaceManager($s2.NameTable)
$ns.AddNamespace("a", "http://schemas.openxmlformats.org/drawingml/2006/main")
$ns.AddNamespace("p", "http://schemas.openxmlformats.org/presentationml/2006/main")

$spNodes = $s2.SelectNodes("//p:sp", $ns)
Write-Host "Found $($spNodes.Count) shapes."
foreach ($sp in $spNodes) {
    $t = ($sp.SelectNodes(".//a:t", $ns) | ForEach-Object { $_.InnerText.Trim() }) -join " "
    if ($t -ne "") {
        $fill = $sp.SelectSingleNode(".//a:solidFill/*", $ns)
        $color = if ($fill) { $fill.GetAttribute("val") } else { "none" }
        Write-Host "Shape [color: $color]: $t"
    }
}
