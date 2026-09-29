<#
  Minimal static file server for the Portfolio site.
  Uses .NET HttpListener — no Python or Node required.

  Usage:
    .\serve.ps1            # serves on http://localhost:8080
    .\serve.ps1 -Port 3000 # serves on http://localhost:3000
#>
param(
    [int]$Port = 8080,
    [switch]$Open
)

$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

# Map file extensions to MIME types
$mime = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".webp" = "image/webp"
    ".ico"  = "image/x-icon"
    ".md"   = "text/plain; charset=utf-8"
    ".txt"  = "text/plain; charset=utf-8"
}

Write-Host ""
Write-Host "  Serving Portfolio" -ForegroundColor Green
Write-Host "  Root: $root"
Write-Host "  URL:  http://localhost:$Port" -ForegroundColor Cyan
Write-Host "  Press Ctrl+C to stop."
Write-Host ""

if ($Open) { Start-Process "http://localhost:$Port" }

try {
    while ($listener.IsListening) {
        $ctx = $listener.GetContext()

        # Strip query string and decode
        $path = $ctx.Request.Url.AbsolutePath
        $path = [System.Uri]::UnescapeDataString($path)

        # Default document
        if ($path -eq "/" -or $path -eq "") { $path = "/index.html" }

        # Resolve safely inside the root (blocks ../ traversal)
        $full = [System.IO.Path]::GetFullPath((Join-Path $root $path.TrimStart('/')))
        if (-not $full.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
            $ctx.Response.StatusCode = 403
            $ctx.Response.Close()
            continue
        }

        if (Test-Path $full -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($full)
            $ext = [System.IO.Path]::GetExtension($full).ToLowerInvariant()
            $type = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }

            $ctx.Response.StatusCode = 200
            $ctx.Response.ContentType = $type
            $ctx.Response.ContentLength64 = $bytes.Length
            $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host ("  200  " + $path) -ForegroundColor DarkGray
        }
        else {
            # 404 -> fall back to index.html so SPA anchors still resolve
            $ctx.Response.StatusCode = 404
            $ctx.Response.ContentType = "text/plain; charset=utf-8"
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
            $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
            Write-Host ("  404  " + $path) -ForegroundColor Red
        }

        $ctx.Response.Close()
    }
}
finally {
    $listener.Stop()
    $listener.Close()
}
