Param(
    [switch]$SkipDocker
)

$ErrorActionPreference = 'Continue'

# Get the actual repository root (parent of scripts folder)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptDir
Write-Host "Repository root: $repoRoot"

# Check Java
if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Warning "Java n'est pas trouvé dans le PATH. Assurez-vous que JDK 21 est installé et que JAVA_HOME est configuré." 
} else {
    Write-Host "Java version:"; & java -version
}

if (-not $SkipDocker) {
    Write-Host "Démarrage de PostgreSQL via docker compose..."
    Push-Location $repoRoot
    try {
        # Use docker compose; this works with Docker Desktop or Docker Compose v2
        $proc = Start-Process -FilePath "docker" -ArgumentList "compose","up","-d","postgres" -NoNewWindow -PassThru -Wait -ErrorAction Stop
        if ($proc.ExitCode -ne 0) {
            Write-Warning "docker compose returned exit code $($proc.ExitCode). Vérifiez que Docker est lancé."
        } else {
            Write-Host "Service postgres demandé (compose)."
        }
    } catch {
        Write-Warning "Échec de docker compose: $($_.Exception.Message)" 
        Write-Warning "Si vous n'utilisez pas Docker, créez manuellement la base 'polyrezo_db' et l'utilisateur 'polyrezo_user' ou relancez avec -SkipDocker." 
    }
    Pop-Location
} else {
    Write-Host "SkipDocker activé : je ne démarre pas le container Postgres."
}

# Start backend in a new PowerShell window
$backendPath = Join-Path $repoRoot 'backend'
$backendCmd = "cd `"$backendPath`"; if (Test-Path .\\mvnw.cmd) { .\\mvnw.cmd spring-boot:run } else { mvn spring-boot:run }"
Write-Host "Lancement du backend (nouvelle fenêtre) : $backendPath"
Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command",$backendCmd -WorkingDirectory $backendPath

# Start frontend in a new PowerShell window
$frontendPath = Join-Path $repoRoot 'frontend'
$frontendCmd = "cd `"$frontendPath`"; if (Test-Path package.json) { npm install; npm start }"
Write-Host "Lancement du frontend (nouvelle fenêtre) : $frontendPath"
Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command",$frontendCmd -WorkingDirectory $frontendPath

Write-Host "Tous les processus ont été déclenchés. Vérifiez les fenêtres PowerShell ouvertes pour les logs (backend, frontend)."
