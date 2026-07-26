$path = "src\app\(dashboard)\create\page.tsx"
$lines = Get-Content -LiteralPath $path

$targetIndex = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "const id = uid\('video'\);") {
        $targetIndex = $i
        break
    }
}

if ($targetIndex -eq -1) {
    Write-Host "ERROR: Could not find the uid('video') line. No changes made." -ForegroundColor Red
} else {
    Write-Host "Current line $($targetIndex + 1) is:" -ForegroundColor Yellow
    Write-Host $lines[$targetIndex]
    $lines[$targetIndex] = "    const id = crypto.randomUUID();"
    Set-Content -LiteralPath $path -Value $lines
    Write-Host "SUCCESS: id generation now uses crypto.randomUUID()." -ForegroundColor Green
}
