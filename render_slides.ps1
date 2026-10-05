param([int[]]$pages = @(1, 2, 3, 4, 7, 8, 52))

Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | ? { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]

function Await($WinRtTask, $ResultType) {
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(-1) | Out-Null
    $netTask.Result
}

[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType = WindowsRuntime] | Out-Null

$pdfPath = (Resolve-Path "presentation.pdf").Path
$fileOp = [Windows.Storage.StorageFile]::GetFileFromPathAsync($pdfPath)
$file = Await $fileOp ([Windows.Storage.StorageFile])

$docOp = [Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)
$doc = Await $docOp ([Windows.Data.Pdf.PdfDocument])

Write-Host "Total PDF pages: $($doc.PageCount)"

if (-not (Test-Path "slide_renders")) { New-Item -ItemType Directory -Path "slide_renders" | Out-Null }

foreach ($pNum in $pages) {
    if ($pNum -le $doc.PageCount) {
        $page = $doc.GetPage($pNum - 1)
        $outImgPath = Join-Path (Resolve-Path "slide_renders").Path "slide_$pNum.png"
        $storageFileOp = [Windows.Storage.StorageFolder]::GetFolderFromPathAsync((Resolve-Path "slide_renders").Path)
        $folder = Await $storageFileOp ([Windows.Storage.StorageFolder])
        $createFileOp = $folder.CreateFileAsync("slide_$pNum.png", [Windows.Storage.CreationCollisionOption]::ReplaceExisting)
        $outFile = Await $createFileOp ([Windows.Storage.StorageFile])
        
        $streamOp = $outFile.OpenAsync([Windows.Storage.FileAccessMode]::ReadWrite)
        $stream = Await $streamOp ([Windows.Storage.Streams.IRandomAccessStream])
        
        $renderOp = $page.RenderToStreamAsync($stream)
        $asTaskGenericNoRet = ([System.WindowsRuntimeSystemExtensions].GetMethods() | ? { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncAction' })[0]
        $renderTask = $asTaskGenericNoRet.Invoke($null, @($renderOp))
        $renderTask.Wait(-1) | Out-Null
        
        $stream.FlushAsync().GetResults() | Out-Null
        $stream.Dispose()
        Write-Host "Rendered slide $pNum to $outImgPath"
    }
}
