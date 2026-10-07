[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$tempUserData = "C:\temp\chrome_ud_geo"
if (!(Test-Path $tempUserData)) { New-Item -ItemType Directory -Path $tempUserData -Force | Out-Null }
$tempShot = "C:\temp\shot_geovisor.png"
if (Test-Path $tempShot) { Remove-Item $tempShot -Force }

$proc = Start-Process $chromePath -ArgumentList @(
    '--headless=new',
    '--disable-gpu',
    "--user-data-dir=$tempUserData",
    '--virtual-time-budget=4000',
    '--window-size=1600,1400',
    "--screenshot=$tempShot",
    "http://localhost:8085/#resumen"
) -Wait -PassThru -NoNewWindow

if (Test-Path $tempShot) {
    Add-Type -AssemblyName System.Drawing
    $bmp = [System.Drawing.Bitmap]::FromFile($tempShot)
    Write-Host "Image size: $($bmp.Width) x $($bmp.Height)"
    
    # Crop around the Geovisor Card (header and map)
    $startY = 490
    $cropHeight = [Math]::Min(750, $bmp.Height - $startY)
    $cropRect = New-Object System.Drawing.Rectangle(0, $startY, $bmp.Width, $cropHeight)
    $cropBmp = $bmp.Clone($cropRect, $bmp.PixelFormat)

    $targetImg = "$PSScriptRoot/screenshot_geovisor_crop.png"
    $cropBmp.Save($targetImg, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropBmp.Dispose()
    $bmp.Dispose()

    # Also copy to artifacts dir
    $artifactDest = "C:\Users\JMARINGA\.gemini\antigravity-ide\brain\3256430f-a3a5-49a3-8aea-c6c5cee047e8\geovisor_crop.png"
    Copy-Item $targetImg $artifactDest -Force

    Write-Host "Success! Cropped Geovisor saved to $targetImg and $artifactDest ($((Get-Item $targetImg).Length) bytes)"
} else {
    Write-Host "Screenshot failed, tempShot not found."
}
