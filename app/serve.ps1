$port = 5173
$root = "$PSScriptRoot\dist"

Write-Host "Starting HTTP server on port $port from directory $root"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")
$listener.Start()

Write-Host "Server started. Listening on:"
Write-Host "  http://localhost:$port"
Write-Host "  http://127.0.0.1:$port"
Write-Host "Press Ctrl+C to stop."
Write-Host ""

$encoding = [System.Text.Encoding]::UTF8

while ($listener.IsListening) {
    $asyncResult = $listener.BeginGetContext($null, $null)
    
    while (-not $asyncResult.IsCompleted) {
        Start-Sleep -Milliseconds 100
    }
    
    try {
        $context = $listener.EndGetContext($asyncResult)
        $request = $context.Request
        $response = $context.Response
        
        $path = $request.Url.LocalPath
        if ($path -eq "/") {
            $path = "/index.html"
        }
        
        $filePath = Join-Path $root $path.TrimStart("/")
        
        Write-Host "$(Get-Date -Format 'HH:mm:ss') $($request.HttpMethod) $path"
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            $extension = [System.IO.Path]::GetExtension($filePath)
            switch ($extension) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".css" { $response.ContentType = "text/css; charset=utf-8" }
                ".js" { $response.ContentType = "application/javascript; charset=utf-8" }
                ".json" { $response.ContentType = "application/json; charset=utf-8" }
                ".png" { $response.ContentType = "image/png" }
                ".jpg" { $response.ContentType = "image/jpeg" }
                ".jpeg" { $response.ContentType = "image/jpeg" }
                ".gif" { $response.ContentType = "image/gif" }
                ".svg" { $response.ContentType = "image/svg+xml" }
                ".ico" { $response.ContentType = "image/x-icon" }
                default { $response.ContentType = "application/octet-stream" }
            }
            
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $buffer = $encoding.GetBytes("404 Not Found: $path")
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        
        $response.Close()
    } catch {
        if ($listener.IsListening) {
            Write-Host "Error: $($_.Exception.Message)"
        }
    }
}

$listener.Stop()
$listener.Dispose()
Write-Host "Server stopped."