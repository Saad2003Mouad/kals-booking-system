$dir = "C:\Users\Sharoobi\Desktop\boston_legend.webflow.io\public"
$files = Get-ChildItem $dir -Filter "*.html" -Recurse

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $updated = $content -replace 'bl-widgets\.js\?v=[\w\-\.]+', 'bl-widgets.js?v=2026-06-08-1'
    if ($content -ne $updated) {
        [System.IO.File]::WriteAllText($file.FullName, $updated, [System.Text.Encoding]::UTF8)
        Write-Host "Updated: $($file.Name)"
    }
}

Write-Host "Done."
