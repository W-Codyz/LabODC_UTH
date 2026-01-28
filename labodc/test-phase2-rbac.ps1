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

Write-Host "== Phase 2 RBAC/negative-case test ==" -ForegroundColor Cyan
Write-Host "BaseUrl: $BaseUrl" -ForegroundColor Cyan

# 0) Create ENTERPRISE + project (PENDING)
$enterpriseEmail = "enterprise_$([guid]::NewGuid().ToString('N'))@labodc.local"
$pass  = 'P@ssw0rd123'

$regEnterprise = Invoke-Json -Method POST -Url "$BaseUrl/auth/register" -Body @{ email = $enterpriseEmail; password = $pass; role = 'ENTERPRISE' }
Assert-Status -Name 'POST /auth/register (ENTERPRISE)' -Result $regEnterprise -ExpectedStatus 200

$loginEnterprise = Invoke-Json -Method POST -Url "$BaseUrl/auth/login" -Body @{ email = $enterpriseEmail; password = $pass }
Assert-Status -Name 'POST /auth/login (ENTERPRISE)' -Result $loginEnterprise -ExpectedStatus 200

$tokenEnterprise = $loginEnterprise.Json.token
$authEnterprise = @{ Authorization = "Bearer $tokenEnterprise" }

$createProject = Invoke-Json -Method POST -Url "$BaseUrl/projects" -Headers $authEnterprise -Body @{ name = 'RBAC Project'; description = 'rbac' }
Assert-Status -Name 'POST /projects (ENTERPRISE)' -Result $createProject -ExpectedStatus 201

$projectId = $createProject.Json.id
if (-not $projectId) { throw 'Create project did not return id' }

# 1) Create TALENT
$talentEmail = "talent_$([guid]::NewGuid().ToString('N'))@labodc.local"
$regTalent = Invoke-Json -Method POST -Url "$BaseUrl/auth/register" -Body @{ email = $talentEmail; password = $pass; role = 'TALENT' }
Assert-Status -Name 'POST /auth/register (TALENT)' -Result $regTalent -ExpectedStatus 200

$loginTalent = Invoke-Json -Method POST -Url "$BaseUrl/auth/login" -Body @{ email = $talentEmail; password = $pass }
Assert-Status -Name 'POST /auth/login (TALENT)' -Result $loginTalent -ExpectedStatus 200

$tokenTalent = $loginTalent.Json.token
$authTalent = @{ Authorization = "Bearer $tokenTalent" }

# 2) Create LAB_ADMIN
$adminEmail = "labadmin_$([guid]::NewGuid().ToString('N'))@labodc.local"
$regAdmin = Invoke-Json -Method POST -Url "$BaseUrl/auth/register" -Body @{ email = $adminEmail; password = $pass; role = 'LAB_ADMIN' }
Assert-Status -Name 'POST /auth/register (LAB_ADMIN)' -Result $regAdmin -ExpectedStatus 200

$loginAdmin = Invoke-Json -Method POST -Url "$BaseUrl/auth/login" -Body @{ email = $adminEmail; password = $pass }
Assert-Status -Name 'POST /auth/login (LAB_ADMIN)' -Result $loginAdmin -ExpectedStatus 200

$tokenAdmin = $loginAdmin.Json.token
$authAdmin = @{ Authorization = "Bearer $tokenAdmin" }

Write-Host "== Negative cases ==" -ForegroundColor Cyan

# A) ENTERPRISE cannot approve
$enterpriseApprove = Invoke-Json -Method PUT -Url "$BaseUrl/projects/$projectId/approve" -Headers $authEnterprise
Assert-Status -Name 'PUT /projects/{id}/approve (ENTERPRISE token)' -Result $enterpriseApprove -ExpectedStatus 403

# B) TALENT cannot approve
$talentApprove = Invoke-Json -Method PUT -Url "$BaseUrl/projects/$projectId/approve" -Headers $authTalent
Assert-Status -Name 'PUT /projects/{id}/approve (TALENT token)' -Result $talentApprove -ExpectedStatus 403

# C) TALENT cannot join before approved
$talentJoinBefore = Invoke-Json -Method POST -Url "$BaseUrl/projects/$projectId/join" -Headers $authTalent
Assert-Status -Name 'POST /projects/{id}/join before approved (TALENT)' -Result $talentJoinBefore -ExpectedStatus 400

# D) TALENT cannot view project detail before being member (and not admin)
$talentViewBefore = Invoke-Json -Method GET -Url "$BaseUrl/projects/$projectId" -Headers $authTalent
Assert-Status -Name 'GET /projects/{id} before membership (TALENT)' -Result $talentViewBefore -ExpectedStatus 403

Write-Host "== Positive cases ==" -ForegroundColor Cyan

# E) LAB_ADMIN approves
$adminApprove = Invoke-Json -Method PUT -Url "$BaseUrl/projects/$projectId/approve" -Headers $authAdmin
Assert-Status -Name 'PUT /projects/{id}/approve (LAB_ADMIN)' -Result $adminApprove -ExpectedStatus 200

# F) TALENT can join after approved
$talentJoinAfter = Invoke-Json -Method POST -Url "$BaseUrl/projects/$projectId/join" -Headers $authTalent
Assert-Status -Name 'POST /projects/{id}/join after approved (TALENT)' -Result $talentJoinAfter -ExpectedStatus 200

# G) TALENT can view after membership
$talentViewAfter = Invoke-Json -Method GET -Url "$BaseUrl/projects/$projectId" -Headers $authTalent
Assert-Status -Name 'GET /projects/{id} after membership (TALENT)' -Result $talentViewAfter -ExpectedStatus 200

Write-Host "All RBAC/negative-case tests passed." -ForegroundColor Green
