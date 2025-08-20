$ErrorActionPreference = 'Stop'

# 1) Pastikan project_tree.txt ada
if (-not (Test-Path .\project_tree.txt)) {
  tree /A /F | Out-File -Encoding utf8 project_tree.txt
}

# 2) Konfigurasi
$skipPattern = '\\node_modules\\|\\\.next\\|\\dist\\|\\build\\|\\\.turbo\\|\\coverage\\|\\\.git\\'
$exts = @('.ts','.tsx','.js','.mjs','.cjs','.json','.yml','.yaml','.md')
$out = 'project_dump.md'
$backticks = '```'

# 3) Header + Tree (tanpa here-string, tanpa -Raw)
Set-Content -Encoding utf8 -Path $out -Value "# Project Dump ($(Get-Date -Format u))`r`n"
Add-Content -Encoding utf8 -Path $out -Value "## Tree"
Add-Content -Encoding utf8 -Path $out -Value $backticks
$treeText = [System.IO.File]::ReadAllText((Resolve-Path .\project_tree.txt))
Add-Content -Encoding utf8 -Path $out -Value $treeText
Add-Content -Encoding utf8 -Path $out -Value $backticks
Add-Content -Encoding utf8 -Path $out -Value ""
Add-Content -Encoding utf8 -Path $out -Value "## Files"
Add-Content -Encoding utf8 -Path $out -Value ""

# 4) Kumpulkan file
$rootPath = (Resolve-Path .).Path + [System.IO.Path]::DirectorySeparatorChar
$files = Get-ChildItem -Recurse -File -ErrorAction SilentlyContinue | Where-Object {
  $_.FullName -notmatch $skipPattern -and
  ($exts -contains ([System.IO.Path]::GetExtension($_.FullName).ToLower()))
} | Sort-Object FullName

# 5) Tulis tiap file (tanpa ForEach-Object)
foreach ($f in $files) {
  $rel = $f.FullName.Replace($rootPath,'')
  Add-Content -Encoding utf8 -Path $out -Value ("### `"{0}`"" -f $rel)
  Add-Content -Encoding utf8 -Path $out -Value $backticks
  try {
    $content = [System.IO.File]::ReadAllText($f.FullName)
  } catch {
    $content = "[ERROR membaca file: $($_.Exception.Message)]"
  }
  Add-Content -Encoding utf8 -Path $out -Value $content
  Add-Content -Encoding utf8 -Path $out -Value $backticks
  Add-Content -Encoding utf8 -Path $out -Value ""
}

Write-Host "Selesai: $out"
