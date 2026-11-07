# Install emoji images already saved on this computer for the ROAM prototype.
# This script does not download artwork or communicate with Emojipedia.
# Run from ROAM's root via Install-Apple-Emojis.cmd.
param(
  [string]$SourceDir = (Join-Path ([Environment]::GetFolderPath('UserProfile')) 'Downloads'),
  [switch]$Overwrite
)
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$destination = Join-Path $projectRoot 'assets\apple-emojis'

if (-not (Test-Path -LiteralPath (Join-Path $projectRoot 'index.html'))) {
  throw "Could not locate ROAM's index.html next to the scripts folder."
}
if (-not (Test-Path -LiteralPath $SourceDir -PathType Container)) {
  throw "Source folder does not exist: $SourceDir"
}
New-Item -ItemType Directory -Path $destination -Force | Out-Null

# Common Emojipedia names for the 24 emoji shown in the example keyboard.
# Code-point-based filenames also work for any emoji, including skin tones and flags.
$aliases = @{
  '1f602' = @('face-with-tears-of-joy', 'tears-of-joy')
  '2764' = @('red-heart')
  '1f970' = @('smiling-face-with-hearts')
  '1f60a' = @('smiling-face-with-smiling-eyes')
  '1f60d' = @('smiling-face-with-heart-eyes', 'heart-eyes')
  '1f923' = @('rolling-on-the-floor-laughing', 'rofl')
  '1f62d' = @('loudly-crying-face')
  '1f618' = @('face-blowing-a-kiss', 'face-throwing-a-kiss')
  '1f44d' = @('thumbs-up', 'thumbsup')
  '1f64f' = @('folded-hands', 'person-with-folded-hands')
  '2728' = @('sparkles')
  '1f525' = @('fire')
  '1f605' = @('grinning-face-with-sweat', 'smiling-face-with-open-mouth-and-cold-sweat')
  '1f389' = @('party-popper')
  '1fa77' = @('pink-heart')
  '1f440' = @('eyes')
  '1f973' = @('partying-face')
  '1f914' = @('thinking-face')
  '1f4af' = @('hundred-points', 'hundred')
  '1f60e' = @('smiling-face-with-sunglasses', 'sunglasses')
  '1f480' = @('skull')
  '1f495' = @('two-hearts')
  '1f388' = @('balloon')
  '1faf6' = @('heart-hands')
}

function Find-EmojiKey([string]$fileStem) {
  $normal = ($fileStem.ToLowerInvariant() -replace '[^a-z0-9]+', '-').Trim('-')
  # Full descriptive names first (avoids interpreting "face" as hex).
  $names = @(
    foreach ($key in $aliases.Keys) {
      foreach ($name in $aliases[$key]) {
        [pscustomobject]@{ Key = $key; Name = $name }
      }
    }
  ) | Sort-Object { $_.Name.Length } -Descending
  foreach ($entry in $names) {
    if ($normal -match ('(^|-)' + [regex]::Escape($entry.Name) + '(-|$)')) {
      return $entry.Key
    }
  }
  # Existing Unicode-based filenames, e.g. apple-1f44d-1f3fd.png.
  $groups = [regex]::Matches($normal, '(?<![a-z0-9])([0-9a-f]{3,6}(?:-[0-9a-f]{3,6})*)(?![a-z0-9])')
  foreach ($group in $groups) {
    $parts = @($group.Groups[1].Value.Split('-') | Where-Object { $_ -ne 'fe0f' -and $_ -ne 'fe0e' })
    if ($parts.Count -eq 0) { continue }
    $first = [Convert]::ToInt32($parts[0], 16)
    if ($first -ge 0x1f000 -or ($first -ge 0x2000 -and $first -le 0x3fff)) {
      return ($parts -join '-')
    }
  }
  return $null
}

$images = @(Get-ChildItem -LiteralPath $SourceDir -File |
  Where-Object { $_.Extension.ToLowerInvariant() -in @('.png', '.webp') })
$installed = 0
$skipped = 0
$unmatched = New-Object System.Collections.Generic.List[string]
foreach ($image in $images) {
  $key = Find-EmojiKey $image.BaseName
  if (-not $key) {
    $unmatched.Add($image.Name)
    continue
  }
  $target = Join-Path $destination ($key + $image.Extension.ToLowerInvariant())
  if ((Test-Path -LiteralPath $target) -and -not $Overwrite) {
    $skipped++
    continue
  }
  Copy-Item -LiteralPath $image.FullName -Destination $target -Force
  Write-Host ("Installed " + $image.Name + " -> " + (Split-Path $target -Leaf))
  $installed++
}

Write-Host ""
Write-Host "ROAM emoji folder: $destination"
Write-Host "Installed: $installed | Already present: $skipped | Unmatched: $($unmatched.Count)"
if ($unmatched.Count -gt 0) {
  Write-Host "Some images could not be identified. If an image is missing, rename it to its Unicode code points, e.g. 1f602.png."
}
if ($installed -eq 0) {
  Write-Host "No new emoji images found. Download/save the permitted images yourself, then run this installer again."
}
Write-Host "Restart or refresh ROAM after installing images."
