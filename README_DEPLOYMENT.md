# 🚀 Guide de Démarrage - Application Événements Polytech

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Docker Desktop** (pour la base de données PostgreSQL)
- **Java 21** (pour le backend Spring Boot)
- **Maven** (normalement inclus via le wrapper mvnw)
- **Node.js 18+** et **npm** (pour le frontend Angular)

---

## 🎯 Démarrage Complet de l'Application

### Étape 1 : Démarrer la Base de Données PostgreSQL

```powershell
# À la racine du projet
cd "c:\Users\anasb\OneDrive\Bureau\anas\informatique\ET4\gitkraken\Projet_R-seau"

# Lancer le conteneur Docker PostgreSQL
docker-compose up -d

# Vérifier que le conteneur fonctionne
docker ps
```

✅ **Vérification** : Vous devriez voir `polyrezo-db` dans la liste des conteneurs actifs.

---

### Étape 2 : Démarrer le Backend (API Spring Boot)

```powershell
# Aller dans le dossier backend
cd backend

# Lancer le backend Spring Boot avec Maven Wrapper
.\mvnw.cmd spring-boot:run

# OU si vous avez Maven installé globalement :
mvn spring-boot:run
```

✅ **Vérification** : 
- Le backend démarre sur **http://localhost:8080**
- Attendez le message : `Started BackendApplication in X seconds`
- Les migrations Flyway s'exécutent automatiquement

---

### Étape 3 : Démarrer le Frontend (Angular)

**OUVRIR UN NOUVEAU TERMINAL PowerShell**

```powershell
# Aller dans le dossier frontend
cd "c:\Users\anasb\OneDrive\Bureau\anas\informatique\ET4\gitkraken\Projet_R-seau\frontend"

# Installer les dépendances (première fois seulement)
npm install

# Lancer le serveur de développement Angular
npm start
```

✅ **Vérification** : 
- Le frontend démarre sur **http://localhost:4200**
- Attendez le message : `Application bundle generation complete`

---

## 🌐 Accéder à l'Application

1. **Ouvrir votre navigateur** et aller sur : **http://localhost:4200/login.html**

2. **Se connecter** avec les identifiants de test :

   **Mode Utilisateur :**
   - Email : `test@polytech.fr` (ou n'importe quel email avec @)
   - Mot de passe : `123456` (minimum 6 caractères)

   **Mode Admin :**
   - Username : `admin`
   - Mot de passe : `password123`

3. **Après connexion**, vous serez redirigé vers : **http://localhost:4200/dashboard.html**

---

## 📂 URLs Importantes

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend (Login)** | http://localhost:4200/login.html | Page de connexion |
| **Frontend (Dashboard)** | http://localhost:4200/dashboard.html | Carte des événements |
| **Backend API** | http://localhost:8080 | API REST Spring Boot |
| **Base de données** | localhost:5433 | PostgreSQL (port 5433) |

---

## 🛠️ Commandes Utiles

### Arrêter l'application

```powershell
# Arrêter le backend : Ctrl+C dans le terminal du backend

# Arrêter le frontend : Ctrl+C dans le terminal du frontend

# Arrêter la base de données
docker-compose down
```

### Redémarrer proprement

```powershell
# 1. Arrêter tout
docker-compose down
# Ctrl+C dans les terminaux backend et frontend

# 2. Redémarrer dans l'ordre
docker-compose up -d
cd backend
.\mvnw.cmd spring-boot:run

# Dans un autre terminal
cd frontend
npm start
```

### Vérifier les logs

```powershell
# Logs de la base de données
docker logs polyrezo-db

# Logs du backend : visibles dans le terminal où vous avez lancé mvnw

# Logs du frontend : visibles dans le terminal où vous avez lancé npm start
```

---

## 🐛 Résolution de Problèmes

### ❌ "Cannot GET /login.html"

**Solution** : Utilisez l'URL complète avec `.html` :
- ✅ `http://localhost:4200/login.html`
- ❌ `http://localhost:4200/login`

### ❌ Image de la carte ne s'affiche pas

**Solution** : L'image `carte_france.png` est maintenant dans `frontend/public/`. Si elle ne s'affiche toujours pas :
1. Vérifiez que le fichier existe : `frontend/public/carte_france.png`
2. Ouvrez la console du navigateur (F12) pour voir les erreurs
3. Essayez de rafraîchir la page (Ctrl+F5)

### ❌ Backend ne démarre pas

**Vérifications** :
1. Docker Desktop est bien démarré
2. Le conteneur PostgreSQL tourne : `docker ps`
3. Le port 8080 n'est pas déjà utilisé
4. Java 21 est installé : `java -version`

### ❌ Frontend ne démarre pas

**Solution** :
```powershell
# Nettoyer et réinstaller
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npm start
```

---

## 📊 Architecture de l'Application

```
┌─────────────────────────────────────────────────────────┐
│                    NAVIGATEUR                            │
│  http://localhost:4200/login.html (Frontend Angular)    │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP Requests
                     ↓
┌─────────────────────────────────────────────────────────┐
│            BACKEND SPRING BOOT                           │
│         http://localhost:8080 (API REST)                │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ JDBC
                     ↓
┌─────────────────────────────────────────────────────────┐
│           BASE DE DONNÉES POSTGRESQL                     │
│         localhost:5433 (Docker Container)               │
└─────────────────────────────────────────────────────────┘
```

---

## 🎓 Notes de Développement

### Frontend
- Framework : **Angular 20.3**
- Fichiers statiques dans : `frontend/public/`
- Pages HTML standalone : `login.html`, `dashboard.html`

### Backend
- Framework : **Spring Boot 3.5.6**
- Java : **Version 21**
- Base de données : **PostgreSQL 18**
- ORM : **JPA/Hibernate**
- Migrations : **Flyway**

### Identifiants par défaut (Base de données)
- Database : `polyrezo_db`
- User : `polyrezo_user`
- Password : `SecurePassword@2025!`
- Port : `5433` (mappé depuis le port 5432 du conteneur)

---

## ✅ Checklist de Démarrage Rapide

- [ ] Docker Desktop lancé
- [ ] `docker-compose up -d` exécuté
- [ ] Backend démarré (`mvnw spring-boot:run`)
- [ ] Frontend démarré (`npm start`)
- [ ] Navigateur ouvert sur `http://localhost:4200/login.html`
- [ ] Connexion testée

---

**🎉 Bon développement !**
