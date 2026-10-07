[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$tempUserData = "C:\temp\chrome_ud"
if (!(Test-Path $tempUserData)) { New-Item -ItemType Directory -Path $tempUserData -Force | Out-Null }
$tempShot = "C:\temp\shot_diagrama.png"
if (Test-Path $tempShot) { Remove-Item $tempShot -Force }

$htmlContent = [System.IO.File]::ReadAllText("$PSScriptRoot/index.html", [System.Text.Encoding]::UTF8)
$injector = @"
<script>
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (window.app) {
      window.app.switchTab('detalle');
      window.app.selectCorridorByCode('E-18');
      setTimeout(() => {
        const el = document.getElementById('abscissasContainer');
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      }, 600);
    }
  }, 400);
});
</script>
</body>
"@

$testHtml = $htmlContent.Replace('</body>', $injector)
[System.IO.File]::WriteAllText("$PSScriptRoot/test_diagrama.html", $testHtml, [System.Text.Encoding]::UTF8)

Start-Process $chromePath -ArgumentList @(
    '--headless=new',
    '--disable-gpu',
    "--user-data-dir=$tempUserData",
    '--virtual-time-budget=4000',
    '--window-size=1920,1200',
    "--screenshot=$tempShot",
    "http://localhost:8085/test_diagrama.html"
) -Wait -NoNewWindow

if (Test-Path $tempShot) {
    Copy-Item $tempShot "$PSScriptRoot/screenshot_diagrama.png" -Force
    Write-Host "Success! Screenshot saved to screenshot_diagrama.png ($((Get-Item "$PSScriptRoot/screenshot_diagrama.png").Length) bytes)"
} else {
    Write-Host "Screenshot failed"
}

Remove-Item "$PSScriptRoot/test_diagrama.html" -ErrorAction SilentlyContinue
