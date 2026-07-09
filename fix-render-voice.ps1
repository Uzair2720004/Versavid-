$path = "src\app\api\generate\render\route.ts"
$content = Get-Content $path -Raw

$content = $content -replace `
  'const \{\s*format = "9:16",\s*clips = \[\],\s*music = "uplifting",\s*\} = body as \{ format\?: string; clips\?: unknown\[\]; music\?: string \};', `
  "const {`n    format = `"9:16`",`n    clips = [],`n    music = `"uplifting`",`n    script = `"`",`n  } = body as { format?: string; clips?: unknown[]; music?: string; script?: string };"

$content = $content -replace `
  '(scenes: \(clips as \{ url: string; poster\?: string; duration\?: number \}\[\]\)\.map\(\s*\(clip\) => \(\{\s*elements: \[\s*\{\s*type: "video",\s*src: clip\.url,\s*duration: clip\.duration \?\? 5,\s*\},\s*\],\s*\}\)\s*\),)', `
  "`$1`n          elements: script`n            ? [`n                {`n                  type: `"voice`",`n                  text: script.replace(/\[[^\]]+\]/g, `"`"`").trim(),`n                  voice: `"en-US-EmmaMultilingualNeural`",`n                  model: `"azure`",`n                },`n                {`n                  type: `"subtitles`",`n                  language: `"auto`",`n                },`n              ]`n            : [],"

Set-Content $path $content -NoNewline
Write-Host "Done. File updated."