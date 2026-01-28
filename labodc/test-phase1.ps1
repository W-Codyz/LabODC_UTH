$ErrorActionPreference = 'Stop'

$BaseUrl = 'http://localhost:8085'

function Invoke-Json {
    param(
        [Parameter(Mandatory)] [ValidateSet('GET','POST','PUT','DELETE')] [string] $Method,
        [Parameter(Mandatory)] [string] $Url,
        [object] $Body = $null,
        [hashtable] $Headers = @{}
    )

    $jsonBody = $null
    if ($null -ne $Body) {
        $jsonBody = $Body | ConvertTo-Json -Depth 10
    }

    try {
        $resp = Invoke-WebRequest -UseBasicParsing -Method $Method -Uri $Url -Headers $Headers -ContentType 'application/json' -Body $jsonBody
        $parsed = $null
        if ($resp.Content) {
            try { $parsed = $resp.Content | ConvertFrom-Json } catch { }
        }
        return [pscustomobject]@{
            Ok     = $true
            Status = [int]$resp.StatusCode
            Raw    = $resp.Content
            Json   = $parsed
        }
    } catch {
        $webResp = $_.Exception.Response
        if ($webResp) {
            $status = [int]$webResp.StatusCode
            $content = ''
            try {
                $reader = New-Object System.IO.StreamReader($webResp.GetResponseStream())
                $content = $reader.ReadToEnd()
            } catch { }

            $parsed = $null
            if ($content) {
                try { $parsed = $content | ConvertFrom-Json } catch { }
            }

            return [pscustomobject]@{
                Ok     = $false
                Status = $status
                Raw    = $content
                Json   = $parsed
            }
        }
        throw
    }
}

function Assert-Status {
    param(
        [Parameter(Mandatory)] [string] $Name,
        [Parameter(Mandatory)] $Result,
        [Parameter(Mandatory)] [int] $ExpectedStatus
    )

    if ($Result.Status -ne $ExpectedStatus) {
        Write-Host "[FAIL] $Name -> expected HTTP $ExpectedStatus, got HTTP $($Result.Status)" -ForegroundColor Red
        if ($Result.Raw) { Write-Host "Body: $($Result.Raw)" }
        exit 1
    }
    Write-Host "[OK]   $Name -> HTTP $ExpectedStatus" -ForegroundColor Green
}

Write-Host "== Phase 1 smoke test (Gateway/Auth/User) ==" -ForegroundColor Cyan
Write-Host "BaseUrl: $BaseUrl" -ForegroundColor Cyan

# 0) Gateway health
$health = Invoke-Json -Method GET -Url "$BaseUrl/actuator/health"
Assert-Status -Name 'Gateway health' -Result $health -ExpectedStatus 200

# 1) Unauthorized access should fail
$noTokenMe = Invoke-Json -Method GET -Url "$BaseUrl/users/me"
Assert-Status -Name 'GET /users/me without token' -Result $noTokenMe -ExpectedStatus 401

# 2) Register + login as ADMIN
$adminEmail = "admin_$([guid]::NewGuid().ToString('N'))@labodc.local"
$adminPass  = 'P@ssw0rd123'

$regAdmin = Invoke-Json -Method POST -Url "$BaseUrl/auth/register" -Body @{ email = $adminEmail; password = $adminPass; role = 'ADMIN' }
Assert-Status -Name 'POST /auth/register (ADMIN)' -Result $regAdmin -ExpectedStatus 200

$loginAdmin = Invoke-Json -Method POST -Url "$BaseUrl/auth/login" -Body @{ email = $adminEmail; password = $adminPass }
Assert-Status -Name 'POST /auth/login (ADMIN)' -Result $loginAdmin -ExpectedStatus 200

$tokenAdmin = $loginAdmin.Json.token
if (-not $tokenAdmin) {
    Write-Host "[FAIL] Login did not return token" -ForegroundColor Red
    exit 1
}

$authHeaderAdmin = @{ Authorization = "Bearer $tokenAdmin" }

# 3) /users/me should work with token
$meAdmin = Invoke-Json -Method GET -Url "$BaseUrl/users/me" -Headers $authHeaderAdmin
Assert-Status -Name 'GET /users/me (ADMIN)' -Result $meAdmin -ExpectedStatus 200

# 4) Update profile
$updateMe = Invoke-Json -Method PUT -Url "$BaseUrl/users/me" -Headers $authHeaderAdmin -Body @{ fullName = 'Admin Test'; skills = 'Spring, Docker'; portfolioUrl = 'https://example.com' }
Assert-Status -Name 'PUT /users/me (ADMIN)' -Result $updateMe -ExpectedStatus 200

# 5) by-role should allow admin
$byRoleAdmin = Invoke-Json -Method GET -Url "$BaseUrl/users/by-role/ADMIN" -Headers $authHeaderAdmin
Assert-Status -Name 'GET /users/by-role/ADMIN (ADMIN token)' -Result $byRoleAdmin -ExpectedStatus 200

# 6) Register + login as TALENT then ensure forbidden on by-role
$talentEmail = "talent_$([guid]::NewGuid().ToString('N'))@labodc.local"
$talentPass  = 'P@ssw0rd123'

$regTalent = Invoke-Json -Method POST -Url "$BaseUrl/auth/register" -Body @{ email = $talentEmail; password = $talentPass; role = 'TALENT' }
Assert-Status -Name 'POST /auth/register (TALENT)' -Result $regTalent -ExpectedStatus 200

$loginTalent = Invoke-Json -Method POST -Url "$BaseUrl/auth/login" -Body @{ email = $talentEmail; password = $talentPass }
Assert-Status -Name 'POST /auth/login (TALENT)' -Result $loginTalent -ExpectedStatus 200

$tokenTalent = $loginTalent.Json.token
$authHeaderTalent = @{ Authorization = "Bearer $tokenTalent" }

$byRoleForbidden = Invoke-Json -Method GET -Url "$BaseUrl/users/by-role/ADMIN" -Headers $authHeaderTalent
Assert-Status -Name 'GET /users/by-role/ADMIN (TALENT token)' -Result $byRoleForbidden -ExpectedStatus 403

Write-Host "All smoke tests passed." -ForegroundColor Green
