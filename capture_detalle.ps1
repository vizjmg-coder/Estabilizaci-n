[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$htmlContent = [System.IO.File]::ReadAllText("$PSScriptRoot/index.html", [System.Text.Encoding]::UTF8)

# Inject auto-switch to Detalle and select E-18 on load
$injector = @"
<script>
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (window.app) {
      window.app.switchTab('detalle');
      window.app.selectCorridorByCode('E-18');
    }
  }, 400);
});
</script>
</body>
"@

$detalleHtml = $htmlContent.Replace('</body>', $injector)
[System.IO.File]::WriteAllText("$PSScriptRoot/test_detalle.html", $detalleHtml, [System.Text.Encoding]::UTF8)

$tempUserData = "C:\temp\chrome_ud"
if (!(Test-Path $tempUserData)) { New-Item -ItemType Directory -Path $tempUserData -Force | Out-Null }
$tempShot = "C:\temp\shot_detalle.png"
if (Test-Path $tempShot) { Remove-Item $tempShot -Force }

$targetImg = "$PSScriptRoot/screenshot_detalle_full.png"

$proc = Start-Process $chromePath -ArgumentList @(
    '--headless=new',
    '--disable-gpu',
    "--user-data-dir=$tempUserData",
    '--virtual-time-budget=4000',
    '--window-size=1920,6000',
    "--screenshot=$tempShot",
    "http://localhost:8085/test_detalle.html"
) -Wait -PassThru -NoNewWindow

if (Test-Path $tempShot) {
    Copy-Item $tempShot $targetImg -Force
    Write-Host "Success! Screenshot saved to $targetImg ($((Get-Item $targetImg).Length) bytes)"
} else {
    Write-Host "Screenshot failed, tempShot not found."
}

Remove-Item "$PSScriptRoot/test_detalle.html" -ErrorAction SilentlyContinue
