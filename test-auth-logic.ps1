# Test du comportement d'authentification

Write-Host "=== Test d'authentification Backend ===" -ForegroundColor Cyan

# Test 1: Bon mot de passe
Write-Host "`nTest 1: Avec le BON mot de passe (dev123)" -ForegroundColor Yellow
$goodLogin = @{
    email = "dev@polyrezo.com"
    password = "dev123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $goodLogin `
        -ErrorAction Stop
    
    Write-Host "Success: $($response.success)" -ForegroundColor $(if ($response.success) { "Green" } else { "Red" })
    Write-Host "Message: $($response.message)" -ForegroundColor $(if ($response.success) { "Green" } else { "Red" })
    if ($response.user) {
        Write-Host "User ID: $($response.user.id)" -ForegroundColor Green
        Write-Host "Role: $($response.user.role)" -ForegroundColor Green
    }
} catch {
    Write-Host "ERREUR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Mauvais mot de passe
Write-Host "`nTest 2: Avec un MAUVAIS mot de passe" -ForegroundColor Yellow
$badLogin = @{
    email = "dev@polyrezo.com"
    password = "wrongpassword123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $badLogin `
        -ErrorAction Stop
    
    Write-Host "Success: $($response.success)" -ForegroundColor $(if ($response.success) { "Red" } else { "Green" })
    Write-Host "Message: $($response.message)" -ForegroundColor $(if ($response.success) { "Red" } else { "Green" })
    
    if ($response.success) {
        Write-Host "PROBLEME: Le backend accepte un mauvais mot de passe!" -ForegroundColor Red
    } else {
        Write-Host "CORRECT: Le backend rejette le mauvais mot de passe" -ForegroundColor Green
    }
} catch {
    Write-Host "CORRECT: Requete rejetee (401)" -ForegroundColor Green
}

# Test 3: Email inexistant
Write-Host "`nTest 3: Avec un email INEXISTANT" -ForegroundColor Yellow
$noUserLogin = @{
    email = "inexistant@test.com"
    password = "anypassword"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $noUserLogin `
        -ErrorAction Stop
    
    Write-Host "Success: $($response.success)" -ForegroundColor $(if ($response.success) { "Red" } else { "Green" })
    Write-Host "Message: $($response.message)" -ForegroundColor $(if ($response.success) { "Red" } else { "Green" })
    
    if ($response.success) {
        Write-Host "PROBLEME: Le backend accepte un email inexistant!" -ForegroundColor Red
    } else {
        Write-Host "CORRECT: Le backend rejette l'email inexistant" -ForegroundColor Green
    }
} catch {
    Write-Host "CORRECT: Requete rejetee (401)" -ForegroundColor Green
}

Write-Host "`n=== CONCLUSION ===" -ForegroundColor Cyan
Write-Host "Si tous les tests sont CORRECTS, le probleme vient du FRONTEND." -ForegroundColor Yellow
Write-Host "Verifiez dans la console du navigateur (F12) les reponses HTTP." -ForegroundColor Yellow
