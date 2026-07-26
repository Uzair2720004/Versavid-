$path = "src\app\(dashboard)\create\page.tsx"
$lines = Get-Content -LiteralPath $path

$targetIndex = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "from 'next/navigation'") {
        $targetIndex = $i
        break
    }
}

if ($targetIndex -eq -1) {
    Write-Host "ERROR: Could not find the useRouter import line. No changes made." -ForegroundColor Red
} elseif (($lines -join "`n") -match "from '@/lib/store'") {
    Write-Host "Nothing to do - useApp import already present." -ForegroundColor Yellow
} else {
    $before = $lines[0..$targetIndex]
    $after = $lines[($targetIndex + 1)..($lines.Count - 1)]
    $insert = @(
        "import { useApp } from '@/lib/store';",
        "import { uid } from '@/lib/utils';"
    )
    $updated = $before + $insert + $after
    Set-Content -LiteralPath $path -Value $updated
    Write-Host "SUCCESS: imports added." -ForegroundColor Green
}
