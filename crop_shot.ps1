Add-Type -AssemblyName System.Drawing

$src = Join-Path $PSScriptRoot "screenshot_detalle_full.png"
$bmp = [System.Drawing.Bitmap]::FromFile($src)

$startY = 2450
$height = 2000
if ($startY + $height -gt $bmp.Height) {
    $height = $bmp.Height - $startY
}

$cropRect = New-Object System.Drawing.Rectangle(0, $startY, $bmp.Width, $height)
$cropBmp = $bmp.Clone($cropRect, $bmp.PixelFormat)

$outPath = Join-Path $PSScriptRoot "screenshot_abscissas_crop.png"
$cropBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$cropBmp.Dispose()
$bmp.Dispose()
Write-Host "Success! Cropped image saved to: $outPath ($((Get-Item $outPath).Length) bytes)"
