# Script de test pour vérifier que le backend fonctionne

Write-Host "=== Test de connexion au backend ===" -ForegroundColor Cyan

# 1. Vérifier si le backend répond
Write-Host "`n1. Test de disponibilité du backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/hello" -Method GET -ErrorAction Stop
    Write-Host "OK - Backend accessible (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "ERREUR - Backend non accessible" -ForegroundColor Red
    Write-Host "  Details: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Tester la connexion avec le compte dev
Write-Host "`n2. Test de connexion avec dev@polyrezo.com..." -ForegroundColor Yellow

$loginData = @{
    email = "dev@polyrezo.com"
    password = "dev123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginData `
        -ErrorAction Stop
    
    if ($response.success) {
        Write-Host "OK - Connexion reussie !" -ForegroundColor Green
        Write-Host "  User: $($response.user.firstName) $($response.user.lastName)" -ForegroundColor Green
        Write-Host "  Role: $($response.user.role)" -ForegroundColor Green
        Write-Host "  Email: $($response.user.email)" -ForegroundColor Green
    } else {
        Write-Host "ERREUR - Connexion echouee: $($response.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "ERREUR - Impossible de se connecter" -ForegroundColor Red
    Write-Host "  Details: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Test avec un compte qui n'existe pas
Write-Host "`n3. Test avec un email invalide (doit echouer)..." -ForegroundColor Yellow

$badLoginData = @{
    email = "test@invalid.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $badLoginData `
        -ErrorAction Stop
    
    if ($response.success) {
        Write-Host "ERREUR - Connexion reussie avec un compte invalide !" -ForegroundColor Red
    } else {
        Write-Host "OK - Rejet correct: $($response.message)" -ForegroundColor Green
    }
} catch {
    Write-Host "OK - Rejet correct (erreur 401)" -ForegroundColor Green
}

Write-Host "`n=== Tests termines ===" -ForegroundColor Cyan
