[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[xml]$s3 = Get-Content -Raw -Encoding UTF8 'pptx_extracted/ppt/slides/slide3.xml'
$ns = New-Object System.Xml.XmlNamespaceManager($s3.NameTable)
$ns.AddNamespace("a", "http://schemas.openxmlformats.org/drawingml/2006/main")
$ns.AddNamespace("p", "http://schemas.openxmlformats.org/presentationml/2006/main")

Write-Host "--- Tables in Slide 3 ---"
$tables = $s3.SelectNodes("//a:tbl", $ns)
$tIndex = 1
foreach ($tbl in $tables) {
    Write-Host "`nTable $tIndex :"
    $rows = $tbl.SelectNodes("./a:tr", $ns)
    foreach ($r in $rows) {
        $cells = $r.SelectNodes("./a:tc", $ns)
        $cTexts = @()
        foreach ($c in $cells) {
            $t = ($c.SelectNodes(".//a:t", $ns) | ForEach-Object { $_.InnerText.Trim() }) -join " "
            $cTexts += $t
        }
        Write-Host "  | " ($cTexts -join " | ") " |"
    }
    $tIndex++
}

Write-Host "`n--- Shapes with text in Slide 3 ---"
$spNodes = $s3.SelectNodes("//p:sp", $ns)
foreach ($sp in $spNodes) {
    $t = ($sp.SelectNodes(".//a:t", $ns) | ForEach-Object { $_.InnerText.Trim() }) -join " "
    if ($t -ne "") {
        Write-Host "Shape: $t"
    }
}
