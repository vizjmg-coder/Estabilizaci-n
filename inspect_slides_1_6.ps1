[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$slides = Get-Content 'slides_summary.json' -Raw -Encoding UTF8 | ConvertFrom-Json
foreach ($s in $slides) {
    if ($s.Slide -le 6) {
        Write-Host "================== SLIDE $($s.Slide) =================="
        Write-Host $s.FullText
    }
}
