$path = "src\app\api\generate\render\route.ts"
$content = Get-Content $path -Raw

$old = @'
          scenes: (clips as { url: string; poster?: string; duration?: number }[]).map(
            (clip) => ({
              elements: [
                {
                  type: "video",
                  src: clip.url,
                  duration: clip.duration ?? 5,
                },
              ],
            })
          ),
'@

$new = @'
          scenes: [
            ...(clips as { url: string; poster?: string; duration?: number }[]).map(
              (clip) => ({
                elements: [
                  {
                    type: "video",
                    src: clip.url,
                    duration: clip.duration ?? 5,
                  },
                ],
              })
            ),
            ...(images as string[])
              .slice((clips as unknown[]).length)
              .map((img) => ({
                elements: [
                  {
                    type: "image",
                    src: img,
                    duration: 4,
                    zoom: 2,
                  },
                ],
              })),
          ],
'@

$content = $content.Replace($old, $new)

$content = $content -replace `
  'const \{\s*format = "9:16",\s*clips = \[\],\s*music = "uplifting",\s*script = "",\s*\} = body as \{ format\?: string; clips\?: unknown\[\]; music\?: string; script\?: string \};', `
  "const {`n    format = `"9:16`",`n    clips = [],`n    images = [],`n    music = `"uplifting`",`n    script = `"`",`n  } = body as { format?: string; clips?: unknown[]; images?: string[]; music?: string; script?: string };"

Set-Content $path $content -NoNewline
Write-Host "Done. File updated."