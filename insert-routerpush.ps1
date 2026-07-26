$path = "src\app\(dashboard)\create\page.tsx"
$lines = Get-Content -LiteralPath $path

$targetIndex = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '^\s*created_at:\s*new Date\(\)\.toISOString\(\),\s*$') {
        # the closing "});" should be the very next line
        if ($lines[$i+1] -match '^\s*\}\)\s*;\s*$') {
            $targetIndex = $i + 1
            break
        }
    }
}

if ($targetIndex -eq -1) {
    Write-Host "ERROR: Could not find the addVideo closing brace. No changes made." -ForegroundColor Red
} elseif ($lines[$targetIndex + 1] -match 'router\.push') {
    Write-Host "Nothing to do - router.push already present right after addVideo." -ForegroundColor Yellow
} else {
    $before = $lines[0..$targetIndex]
    $after = $lines[($targetIndex + 1)..($lines.Count - 1)]
    $insert = @(
        '',
        '    router.push(`/generate/${id}`);'
    )
    $updated = $before + $insert + $after
    Set-Content -LiteralPath $path -Value $updated
    Write-Host "SUCCESS: router.push inserted." -ForegroundColor Green
}
