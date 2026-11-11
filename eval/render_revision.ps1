$ErrorActionPreference = 'Stop'
$revisionRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\client\src\assets\scs\revision_v28'))
$word = $null
$document = $null
$rendered = @()
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $word.AutomationSecurity = 3
    $word.Options.UpdateLinksAtOpen = $false
    $word.Options.Pagination = $false
    Write-Output 'Word automation started; external link updates disabled.'
    foreach ($name in @('Foraminifer_Manuscript_v28_IEEE_Access','Supplementary_S10_Revision')) {
        $inputPath = Join-Path $revisionRoot ($name + '.docx')
        $outputPath = Join-Path $revisionRoot ($name + '.pdf')
        $document = $word.Documents.Open($inputPath, $false, $true, $false)
        Write-Output ('Opened ' + $name + '; exporting PDF.')
        $document.ExportAsFixedFormat($outputPath, 17)
        $rendered += @{ file = ($name + '.pdf'); pages = $document.ComputeStatistics(2) }
        $document.Close(0)
        [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($document)
        $document = $null
    }
    $rendered | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'results\revision\word_rendering.json') -Encoding UTF8
    $rendered | ConvertTo-Json
} finally {
    if ($document) { $document.Close(0); [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($document) }
    if ($word) { $word.Quit(); [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) }
}
