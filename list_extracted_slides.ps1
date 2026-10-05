[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$slides = Get-Content -Raw -Encoding UTF8 'full_slides_extracted.json' | ConvertFrom-Json

$rows = @()
foreach ($s in $slides) {
    $rows += [PSCustomObject]@{
        Slide = $s.Slide
        Header = $s.Header
        Title = $s.Title
        TablesCount = $s.Tables.Count
        ShapesCount = $s.Shapes.Count
    }
}

$rows | Format-Table -AutoSize | Out-String -Width 220 | Write-Host
