[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$slides = Get-ChildItem 'pptx_extracted/ppt/slides/slide*.xml' | Sort-Object { [int]($_.BaseName -replace '\D') }
$report = @()

foreach ($s in $slides) {
    [xml]$xml = Get-Content -Raw -Encoding UTF8 $s.FullName
    $ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
    $ns.AddNamespace("a", "http://schemas.openxmlformats.org/drawingml/2006/main")
    $ns.AddNamespace("p", "http://schemas.openxmlformats.org/presentationml/2006/main")
    
    $nodes = $xml.SelectNodes("//a:t", $ns)
    $texts = @()
    foreach ($n in $nodes) {
        $t = $n.InnerText.Trim()
        if ($t -ne "") { $texts += $t }
    }
    
    $slideNum = [int]($s.BaseName -replace '\D')
    $summary = [PSCustomObject]@{
        Slide = $slideNum
        TextCount = $texts.Count
        FullText = ($texts -join " | ")
    }
    $report += $summary
}

$report | ConvertTo-Json -Depth 3 | Set-Content -Encoding UTF8 "slides_summary.json"
Write-Host "Processed $($report.Count) slides. Output saved to slides_summary.json"
