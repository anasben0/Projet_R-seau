# 🔐 Comptes de test disponibles

## Compte développeur (Admin)

**Email:** `dev@polyrezo.com`  
**Mot de passe:** `dev123`  
**Rôle:** admin  
**École:** Lyon

Ce compte est créé automatiquement par les migrations Flyway (V4 et V5).

## Vérification rapide

### Via curl (PowerShell)
```powershell
curl.exe -X POST http://localhost:8080/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"dev@polyrezo.com\",\"password\":\"dev123\"}'
```

### Via le fichier HTML de test
Ouvrez `test-login.html` dans votre navigateur et testez la connexion.

### Via le frontend Angular
1. Assurez-vous que le frontend tourne sur http://localhost:4200
2. Allez sur la page de login
3. Utilisez les identifiants ci-dessus

## Troubleshooting

### "Email ou mot de passe incorrect"
- ✅ Le backend vérifie bien contre la base de données
- ✅ Le mot de passe est haché avec BCrypt
- ❌ Vérifiez que les migrations Flyway ont été appliquées (voir logs au démarrage du backend)
- ❌ Vérifiez que la base de données PostgreSQL est bien démarrée

### Erreur CORS
- ✅ Le backend autorise `http://localhost:4200` dans `WebConfig.java`
- ❌ Si vous testez depuis un autre port, ajoutez-le dans `WebConfig.java`

### Backend ne répond pas
- ❌ Vérifiez que le backend est démarré (fenêtre PowerShell ouverte par le script)
- ❌ Vérifiez les logs : "Started BackendApplication in X seconds"
- ❌ Testez http://localhost:8080/api/auth/login avec curl

### Créer de nouveaux comptes

Utilisez l'endpoint `/api/auth/register` :

```powershell
curl.exe -X POST http://localhost:8080/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    \"firstName\":\"John\",
    \"lastName\":\"Doe\",
    \"email\":\"john@example.com\",
    \"password\":\"password123\",
    \"phone\":\"0612345678\",
    \"schoolId\":\"cbf82fd4-4a89-40cc-8822-92b5012f799c\"
  }'
```

Pour obtenir les IDs des écoles disponibles :
```sql
-- Connectez-vous à PostgreSQL
SELECT id, name FROM schools;
```
