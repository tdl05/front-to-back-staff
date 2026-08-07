param(
  [int]$port = 8000,
  [string]$root = (Get-Location).Path
)

$listener = New-Object System.Net.HttpListener
$prefix = "http://127.0.0.1:$port/"
$listener.Prefixes.Add($prefix)
try {
  $listener.Start()
  Write-Output "Listening on $prefix (root: $root)"
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    Start-Job -ArgumentList $context,$root -ScriptBlock {
      param($context,$root)
      try {
        $request = $context.Request
        $path = $request.Url.AbsolutePath.TrimStart('/')
        if ([string]::IsNullOrEmpty($path)) { $path = 'index.html' }
        $file = Join-Path $root $path
        if (Test-Path $file) {
          $bytes = [System.IO.File]::ReadAllBytes($file)
          $ext = [System.IO.Path]::GetExtension($file).ToLower()
          $mime = 'application/octet-stream'
          switch ($ext) {
            '.html' { $mime = 'text/html' }
            '.css'  { $mime = 'text/css' }
            '.js'   { $mime = 'application/javascript' }
            '.png'  { $mime = 'image/png' }
            '.jpg'  { $mime = 'image/jpeg' }
            '.jpeg' { $mime = 'image/jpeg' }
            '.svg'  { $mime = 'image/svg+xml' }
          }
          $context.Response.ContentType = $mime
          $context.Response.ContentLength64 = $bytes.Length
          $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
          $context.Response.OutputStream.Close()
        } else {
          $context.Response.StatusCode = 404
          $buf = [System.Text.Encoding]::UTF8.GetBytes('Not found')
          $context.Response.OutputStream.Write($buf,0,$buf.Length)
          $context.Response.OutputStream.Close()
        }
      } catch {
        try { $context.Response.StatusCode = 500; $context.Response.Close() } catch {}
      }
    } | Out-Null
  }
} catch {
  Write-Error "Server failed: $_"
} finally {
  try { $listener.Stop() } catch {}
}
