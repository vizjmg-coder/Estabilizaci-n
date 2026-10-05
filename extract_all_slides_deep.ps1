[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$slides = Get-ChildItem 'pptx_extracted/ppt/slides/slide*.xml' | Sort-Object { [int]($_.BaseName -replace '\D') }
$allParsed = @()

foreach ($s in $slides) {
    $slideNum = [int]($s.BaseName -replace '\D')
    [xml]$xml = Get-Content -Raw -Encoding UTF8 $s.FullName
    $ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
    $ns.AddNamespace("a", "http://schemas.openxmlformats.org/drawingml/2006/main")
    $ns.AddNamespace("p", "http://schemas.openxmlformats.org/presentationml/2006/main")
    
    # Extract all text paragraphs / shapes
    $shapes = @()
    $spNodes = $xml.SelectNodes("//p:sp", $ns)
    foreach ($sp in $spNodes) {
        $t = ($sp.SelectNodes(".//a:t", $ns) | ForEach-Object { $_.InnerText.Trim() }) -join " "
        if ($t -ne "") {
            $fill = $sp.SelectSingleNode(".//a:solidFill/*", $ns)
            $color = if ($fill) { $fill.GetAttribute("val") } else { "" }
            $shapes += [PSCustomObject]@{
                Text = $t
                Color = $color
            }
        }
    }
    
    # Extract all tables
    $tables = @()
    $tblNodes = $xml.SelectNodes("//a:tbl", $ns)
    foreach ($tbl in $tblNodes) {
        $rowsData = @()
        $rows = $tbl.SelectNodes("./a:tr", $ns)
        foreach ($r in $rows) {
            $cells = $r.SelectNodes("./a:tc", $ns)
            $cTexts = @()
            foreach ($c in $cells) {
                $cTexts += (($c.SelectNodes(".//a:t", $ns) | ForEach-Object { $_.InnerText.Trim() }) -join " ")
            }
            $rowsData += ,$cTexts
        }
        $tables += ,$rowsData
    }
    
    $header = ($shapes | Where-Object { $_.Text -match "INFORME|CONSOLIDADO|Programa" } | Select-Object -First 1).Text
    $title = ($shapes | Where-Object { $_.Text -notmatch "INFORME|CONSOLIDADO|Gobernación|Longitud|Valor|Avance" } | Select-Object -First 1).Text
    
    $allParsed += [PSCustomObject]@{
        Slide = $slideNum
        Header = $header
        Title = $title
        Shapes = $shapes
        Tables = $tables
    }
}

$allParsed | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 "full_slides_extracted.json"
Write-Host "Successfully parsed $($allParsed.Count) slides into full_slides_extracted.json"
