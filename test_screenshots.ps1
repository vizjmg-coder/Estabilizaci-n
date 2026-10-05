[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$url = "file:///" + ($PSScriptRoot -replace '\\', '/') + "/index.html"

Write-Host "Target URL: $url"

# 1. Capture Resumen General
& $chromePath --headless --disable-gpu --window-size=1920,1080 --screenshot="$PSScriptRoot/screenshot_resumen_light.png" --virtual-time-budget=3000 "$url"
Write-Host "Captured screenshot_resumen_light.png"

# 2. Capture Detalle por Corredor
# We can load the page and switch tab or inject a small script to click tabDetalle before screenshot
$detalleHtml = [System.IO.File]::ReadAllText("$PSScriptRoot/index.html", [System.Text.Encoding]::UTF8)
$detalleHtmlSwitch = $detalleHtml.Replace('class="tab-btn active" data-tab="resumen" id="tabResumen"', 'class="tab-btn" data-tab="resumen" id="tabResumen"').Replace('class="tab-btn" data-tab="detalle" id="tabDetalle"', 'class="tab-btn active" data-tab="detalle" id="tabDetalle"').Replace('id="pane-resumen" class="view-pane active"', 'id="pane-resumen" class="view-pane"').Replace('id="pane-detalle" class="view-pane"', 'id="pane-detalle" class="view-pane active"')

[System.IO.File]::WriteAllText("$PSScriptRoot/test_detalle.html", $detalleHtmlSwitch, [System.Text.Encoding]::UTF8)
$detalleUrl = "file:///" + ($PSScriptRoot -replace '\\', '/') + "/test_detalle.html"

& $chromePath --headless --disable-gpu --window-size=1920,1800 --screenshot="$PSScriptRoot/screenshot_detalle_light.png" --virtual-time-budget=3000 "$detalleUrl"
Write-Host "Captured screenshot_detalle_light.png"

Remove-Item "$PSScriptRoot/test_detalle.html" -ErrorAction SilentlyContinue
