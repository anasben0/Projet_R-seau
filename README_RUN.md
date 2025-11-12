# Démarrer le projet (dev)

Ce fichier explique comment démarrer rapidement la base de données, le backend et le frontend en développement sur Windows (PowerShell).

Prérequis
- Java JDK 21 (JAVA_HOME configuré)
- Node.js + npm
- Docker (optionnel, recommandé pour la base PostgreSQL)

Commande recommandée (exécute tout automatiquement)

Ouvrez PowerShell en administrateur (si nécessaire) et exécutez :

```powershell
# depuis la racine du projet
.\scripts\start-all.ps1
```

Options
- Skip Docker (ne pas démarrer la base via Docker Compose) :

```powershell
.\scripts\start-all.ps1 -SkipDocker
```

Que fait le script
- tente de démarrer le service `postgres` via `docker compose up -d postgres` (si Docker disponible)
- ouvre une fenêtre PowerShell pour exécuter le backend avec `mvnw.cmd spring-boot:run`
- ouvre une fenêtre PowerShell pour exécuter le frontend avec `npm install` puis `npm start`

URLs utiles
- Frontend dev : http://localhost:4200
- Backend API : http://localhost:8080 (endpoints sous `/api/...`)

Données de test
- Utilisateur développeur (fourni par les migrations) :
  - email: dev@polyrezo.com
  - mot de passe: dev123

Dépannage rapide
- Si `docker compose` renvoie une erreur : assurez-vous que Docker Desktop est lancé. Sinon créez manuellement la base `polyrezo_db` et l'utilisateur `polyrezo_user` (voir `backend/src/main/resources/application.yml` pour les credentials par défaut).
- Si le backend échoue au démarrage : vérifiez `JAVA_HOME`, la version Java, et les logs de Flyway dans la console où le backend tourne.

Support
Si vous voulez, je peux :
- ajouter un `docker-compose` complet pour builder et exécuter aussi le backend et le frontend en conteneurs
- ajouter un script pour Windows qui ferme proprement les processus démarrés
