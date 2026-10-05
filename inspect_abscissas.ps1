[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[xml]$s3 = Get-Content -Raw -Encoding UTF8 'pptx_extracted/ppt/slides/slide3.xml'
$ns = New-Object System.Xml.XmlNamespaceManager($s3.NameTable)
$ns.AddNamespace("a", "http://schemas.openxmlformats.org/drawingml/2006/main")
$ns.AddNamespace("p", "http://schemas.openxmlformats.org/presentationml/2006/main")

$allSp = $s3.SelectNodes("//p:sp", $ns)
Write-Host "Total shapes in Slide 3: $($allSp.Count)"

$coloredBoxes = @()
foreach ($sp in $allSp) {
    $t = ($sp.SelectNodes(".//a:t", $ns) | ForEach-Object { $_.InnerText.Trim() }) -join " "
    $fill = $sp.SelectSingleNode(".//a:solidFill/*", $ns)
    $color = if ($fill) { $fill.GetAttribute("val") } else { "" }
    $xfrm = $sp.SelectSingleNode(".//a:xfrm/a:off", $ns)
    $ext = $sp.SelectSingleNode(".//a:xfrm/a:ext", $ns)
    $x = if ($xfrm) { [int64]$xfrm.GetAttribute("x") } else { 0 }
    $y = if ($xfrm) { [int64]$xfrm.GetAttribute("y") } else { 0 }
    $w = if ($ext) { [int64]$ext.GetAttribute("cx") } else { 0 }
    $h = if ($ext) { [int64]$ext.GetAttribute("cy") } else { 0 }
    
    if ($color -ne "") {
        $coloredBoxes += [PSCustomObject]@{
            Text = $t
            Color = $color
            X = $x
            Y = $y
            W = $w
            H = $h
        }
    }
}

Write-Host "Shapes with color: $($coloredBoxes.Count)"
$coloredBoxes | Where-Object { $_.Text -eq "" -and $_.H -lt 200000 -and $_.W -gt 10000 } | Select-Object -First 30 | Format-Table -AutoSize | Out-String | Write-Host
