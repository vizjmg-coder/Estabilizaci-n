[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$slides = Get-Content 'slides_summary.json' -Raw -Encoding UTF8 | ConvertFrom-Json
foreach ($s in $slides) {
    $txt = $s.FullText
    if ($txt.Length -gt 160) { $txt = $txt.Substring(0, 160) + "..." }
    Write-Host "[$($s.Slide)] $txt"
}
