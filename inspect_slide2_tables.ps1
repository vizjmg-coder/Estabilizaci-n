[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[xml]$s2 = Get-Content -Raw -Encoding UTF8 'pptx_extracted/ppt/slides/slide2.xml'
$ns = New-Object System.Xml.XmlNamespaceManager($s2.NameTable)
$ns.AddNamespace("a", "http://schemas.openxmlformats.org/drawingml/2006/main")
$ns.AddNamespace("p", "http://schemas.openxmlformats.org/presentationml/2006/main")

Write-Host "--- Tables in Slide 2 ---"
$tables = $s2.SelectNodes("//a:tbl", $ns)
Write-Host "Found $($tables.Count) tables."
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
