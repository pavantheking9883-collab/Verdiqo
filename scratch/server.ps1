# ==========================================
# VERDIQO: LIGHTWEIGHT POWERSHELL WEB SERVER
# Serves Verdiqo assets on http://localhost:8000 and REST API routes on http://localhost:8000/api/...
# ==========================================

$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Verdiqo HTTP server & API running at http://localhost:$port/"
$baseDir = "c:\Users\pavan\OneDrive\Documents\project verdiqo"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath
        
        # Add CORS Headers for API calls
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        
        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }
        
        # Handle REST API Routes
        if ($urlPath.StartsWith("/api/")) {
            $response.ContentType = "application/json; charset=utf-8"
            
            if ($urlPath -eq "/api/auth/login") {
                $resJson = '{"success":true,"token":"JWT-POWERSHELL-MOCK-TOKEN"}'
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes($resJson)
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            }
            elseif ($urlPath -eq "/api/cases" -and $request.HttpMethod -eq "GET") {
                $dbFile = Join-Path $baseDir "scratch\database.json"
                if (Test-Path $dbFile) {
                    $json = Get-Content -Path $dbFile -Raw
                    $resBytes = [System.Text.Encoding]::UTF8.GetBytes($json)
                    $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
                } else {
                    $response.StatusCode = 404
                }
            }
            elseif ($urlPath -eq "/api/cases" -and $request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream)
                $body = $reader.ReadToEnd()
                $newCase = ConvertFrom-Json $body
                
                # Append mock calculations checks
                $newCase.checks = @{
                    identity = @{ status = "GREEN"; reasonEn = "Biometrics verified successfully."; reasonHi = "बायोमेट्रिक्स सफलतापूर्वक सत्यापित।" }
                    finance = @{ status = "CAPABLE"; reasonEn = "Surety capability confirmed."; reasonHi = "जमानतदार क्षमता की पुष्टि की गई।" }
                    risk = @{ score = 15; riskLevel = "LOW"; reasons = @("Low criminal risk profile"); reasonsHi = @("कम आपराधिक जोखिम") }
                    suretyLoad = @{ status = "CLEAR"; reasonEn = "Within legal guarantee limits."; reasonHi = "कानूनी गारंटी सीमा के भीतर।" }
                    property = @{ status = "ELIGIBLE"; reasonEn = "Property verified successfully."; reasonHi = "संपत्ति का सफलतापूर्वक सत्यापन किया गया।" }
                    recommendation = @{ verdict = "GRANT_BAIL"; reasoningEn = "SYSTEM ADVISES TO GRANT BAIL. All checks cleared."; reasoningHi = "सिस्टम जमानत देने की सलाह देता है।" }
                }
                
                $dbFile = Join-Path $baseDir "scratch\database.json"
                $cases = @()
                if (Test-Path $dbFile) {
                    $json = Get-Content -Path $dbFile -Raw
                    $cases = ConvertFrom-Json $json
                }
                
                # Prepend the new case
                $cases = @($newCase) + $cases
                $casesJson = ConvertTo-Json $cases -Depth 10
                [System.IO.File]::WriteAllText($dbFile, $casesJson)
                
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes((ConvertTo-Json $newCase -Depth 10))
                $response.StatusCode = 201
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
            }
            elseif ($urlPath -match "^/api/cases/([^/]+)/verdict" -and $request.HttpMethod -eq "PUT") {
                $caseNo = $Matches[1]
                $reader = New-Object System.IO.StreamReader($request.InputStream)
                $body = $reader.ReadToEnd()
                $payload = ConvertFrom-Json $body
                
                $dbFile = Join-Path $baseDir "scratch\database.json"
                if (Test-Path $dbFile) {
                    $json = Get-Content -Path $dbFile -Raw
                    $cases = ConvertFrom-Json $json
                    
                    foreach ($c in $cases) {
                        if ($c.caseNumber.ToLower() -eq $caseNo.ToLower()) {
                            $c.orderStatus = $payload.verdict
                            $c.judgeRemarks = $payload.remarks
                            $c.digitalSignature = $payload.signature
                            $c.currentStatus = if ($payload.verdict -eq "ADJOURNED") { "Adjourned" } else { "Adjudicated" }
                            if ($payload.verdict -eq "GRANTED" -or $payload.verdict -eq "GRANTED_WITH_CONDITIONS") {
                                $c.surety.mutationStatus = "COMPLETED"
                            }
                        }
                    }
                    
                    $casesJson = ConvertTo-Json $cases -Depth 10
                    [System.IO.File]::WriteAllText($dbFile, $casesJson)
                    
                    $resJson = '{"success":true}'
                    $resBytes = [System.Text.Encoding]::UTF8.GetBytes($resJson)
                    $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
                } else {
                    $response.StatusCode = 404
                }
            }
            else {
                $response.StatusCode = 404
            }
            $response.Close()
            continue
        }

        # Static File Serving
        if ($urlPath -eq "/" -or $urlPath -eq "") {
            $urlPath = "/index.html"
        }
        $urlPath = $urlPath.Replace("/", "\")
        $filePath = Join-Path $baseDir $urlPath
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "text/plain"
            if ($ext -eq ".html") { $contentType = "text/html; charset=utf-8" }
            elseif ($ext -eq ".css") { $contentType = "text/css; charset=utf-8" }
            elseif ($ext -eq ".js") { $contentType = "application/javascript; charset=utf-8" }
            elseif ($ext -eq ".png") { $contentType = "image/png" }
            elseif ($ext -eq ".svg") { $contentType = "image/svg+xml" }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("File Not Found: $urlPath")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    }
} catch {
    Write-Host "Server error encountered: $_"
} finally {
    $listener.Stop()
}
