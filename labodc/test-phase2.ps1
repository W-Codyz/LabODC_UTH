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

Write-Host "== Phase 2 smoke test (Gateway/Auth/Project) ==" -ForegroundColor Cyan
Write-Host "BaseUrl: $BaseUrl" -ForegroundColor Cyan

# 0) Gateway health
$health = Invoke-Json -Method GET -Url "$BaseUrl/actuator/health"
Assert-Status -Name 'Gateway health' -Result $health -ExpectedStatus 200

# 1) Register + login as ENTERPRISE
$enterpriseEmail = "enterprise_$([guid]::NewGuid().ToString('N'))@labodc.local"
$enterprisePass  = 'P@ssw0rd123'

$regEnterprise = Invoke-Json -Method POST -Url "$BaseUrl/auth/register" -Body @{ email = $enterpriseEmail; password = $enterprisePass; role = 'ENTERPRISE' }
Assert-Status -Name 'POST /auth/register (ENTERPRISE)' -Result $regEnterprise -ExpectedStatus 200

$loginEnterprise = Invoke-Json -Method POST -Url "$BaseUrl/auth/login" -Body @{ email = $enterpriseEmail; password = $enterprisePass }
Assert-Status -Name 'POST /auth/login (ENTERPRISE)' -Result $loginEnterprise -ExpectedStatus 200

$tokenEnterprise = $loginEnterprise.Json.token
if (-not $tokenEnterprise) { throw 'Enterprise login did not return token' }
$authEnterprise = @{ Authorization = "Bearer $tokenEnterprise" }

# 2) Create project (PENDING)
$createProject = Invoke-Json -Method POST -Url "$BaseUrl/projects" -Headers $authEnterprise -Body @{ name = 'Phase2 Project'; description = 'Created from smoke test' }
Assert-Status -Name 'POST /projects (ENTERPRISE)' -Result $createProject -ExpectedStatus 201

$projectId = $createProject.Json.id
if (-not $projectId) { throw 'Create project did not return id' }

# 3) Register + login as LAB_ADMIN
$adminEmail = "labadmin_$([guid]::NewGuid().ToString('N'))@labodc.local"
$adminPass  = 'P@ssw0rd123'

$regAdmin = Invoke-Json -Method POST -Url "$BaseUrl/auth/register" -Body @{ email = $adminEmail; password = $adminPass; role = 'LAB_ADMIN' }
Assert-Status -Name 'POST /auth/register (LAB_ADMIN)' -Result $regAdmin -ExpectedStatus 200

$loginAdmin = Invoke-Json -Method POST -Url "$BaseUrl/auth/login" -Body @{ email = $adminEmail; password = $adminPass }
Assert-Status -Name 'POST /auth/login (LAB_ADMIN)' -Result $loginAdmin -ExpectedStatus 200

$tokenAdmin = $loginAdmin.Json.token
if (-not $tokenAdmin) { throw 'LAB_ADMIN login did not return token' }
$authAdmin = @{ Authorization = "Bearer $tokenAdmin" }

# 4) Approve project
$approve = Invoke-Json -Method PUT -Url "$BaseUrl/projects/$projectId/approve" -Headers $authAdmin
Assert-Status -Name 'PUT /projects/{id}/approve (LAB_ADMIN)' -Result $approve -ExpectedStatus 200

# 5) Register + login as TALENT
$talentEmail = "talent_$([guid]::NewGuid().ToString('N'))@labodc.local"
$talentPass  = 'P@ssw0rd123'

$regTalent = Invoke-Json -Method POST -Url "$BaseUrl/auth/register" -Body @{ email = $talentEmail; password = $talentPass; role = 'TALENT' }
Assert-Status -Name 'POST /auth/register (TALENT)' -Result $regTalent -ExpectedStatus 200

$loginTalent = Invoke-Json -Method POST -Url "$BaseUrl/auth/login" -Body @{ email = $talentEmail; password = $talentPass }
Assert-Status -Name 'POST /auth/login (TALENT)' -Result $loginTalent -ExpectedStatus 200

$tokenTalent = $loginTalent.Json.token
if (-not $tokenTalent) { throw 'TALENT login did not return token' }
$authTalent = @{ Authorization = "Bearer $tokenTalent" }

# 6) Join project
$join = Invoke-Json -Method POST -Url "$BaseUrl/projects/$projectId/join" -Headers $authTalent
Assert-Status -Name 'POST /projects/{id}/join (TALENT)' -Result $join -ExpectedStatus 200

# 7) Get my projects should include joined project
$my = Invoke-Json -Method GET -Url "$BaseUrl/projects/my" -Headers $authTalent
Assert-Status -Name 'GET /projects/my (TALENT)' -Result $my -ExpectedStatus 200

Write-Host "All Phase 2 smoke tests passed." -ForegroundColor Green
