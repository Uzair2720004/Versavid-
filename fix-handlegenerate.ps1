$path = "src\app\(dashboard)\create\page.tsx"
$lines = Get-Content -LiteralPath $path

$lineNumber = 56  # 1-indexed line to replace

$new = @(
    "    addVideo({",
    "      id,",
    "      user_id: '',",
    "      title: selections.topic || 'Untitled video',",
    "      topic: selections.topic,",
    "      format: selections.format,",
    "      status: 'pending',",
    "      script: null,",
    "      video_url: null,",
    "      thumbnail_url: null,",
    "      credits_used: credits,",
    "      duration: 0,",
    "      settings: selections as any,",
    "      created_at: new Date().toISOString(),",
    "    });",
    "",
    "    router.push(``/generate/`${id}``);"
)

if ($lines.Count -lt $lineNumber) {
    Write-Host "ERROR: File has fewer than $lineNumber lines. No changes made." -ForegroundColor Red
} else {
    Write-Host "Current line $lineNumber is:" -ForegroundColor Yellow
    Write-Host $lines[$lineNumber - 1]
    $before = $lines[0..($lineNumber - 2)]
    $after = $lines[$lineNumber..($lines.Count - 1)]
    $updated = $before + $new + $after
    Set-Content -LiteralPath $path -Value $updated
    Write-Host "SUCCESS: line $lineNumber replaced." -ForegroundColor Green
}
