# 🧪 Test de connexion avec le backend

## ✅ Prérequis

1. **Backend démarré** :
```bash
cd backend
mvn spring-boot:run
```

2. **PostgreSQL démarré** :
```bash
docker-compose up -d
```

3. **Frontend** : Ouvrir `login.html` dans le navigateur

---

## 🔑 Comptes de test

### Administrateur
- **Email** : `dev@polyrezo.com`
- **Mot de passe** : `dev123`
- **Rôle** : `admin`

### Créer un utilisateur normal
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@polyrezo.com",
    "password": "user123",
    "firstName": "Test",
    "lastName": "User",
    "schoolId": "uuid-de-lyon"
  }'
```

---

## 🧪 Tests manuels

### 1. Test connexion utilisateur
1. Ouvrir `login.html` dans Chrome/Firefox
2. Rester en mode "Utilisateur"
3. Email : `dev@polyrezo.com`
4. Mot de passe : `dev123`
5. Cliquer "Se connecter"
6. ✅ Devrait rediriger vers `dashboard.html`

### 2. Test connexion admin
1. Cliquer "🔐 Accès Administrateur"
2. Email : `dev@polyrezo.com`
3. Mot de passe : `dev123`
4. Cliquer "Se connecter en tant qu'Admin"
5. ✅ Devrait rediriger vers `dashboard.html`

### 3. Test erreur identifiants
1. Email : `wrong@test.com`
2. Mot de passe : `wrongpassword`
3. Cliquer "Se connecter"
4. ❌ Devrait afficher "Email ou mot de passe incorrect"

---

## 🔍 Vérifier dans la console du navigateur

Ouvrir les DevTools (F12) et vérifier :

### Console
```javascript
// Vérifier les données sauvegardées après connexion
console.log(JSON.parse(localStorage.getItem('polytech_user')));

// Devrait afficher :
{
  id: "uuid-de-l-utilisateur",
  email: "dev@polyrezo.com",
  firstName: "Dev",
  lastName: "Admin",
  role: "admin",
  schoolId: "uuid-de-lyon",
  schoolName: "Polytech Lyon"
}
```

### Network (Onglet Réseau)
1. Aller dans "Network" / "Réseau"
2. Effectuer une connexion
3. Chercher la requête `POST /api/auth/login`
4. Vérifier :
   - **Status** : 200 OK
   - **Request Payload** : `{"email":"dev@polyrezo.com","password":"dev123"}`
   - **Response** : Objet JSON avec les données utilisateur

---

## ❌ Problèmes courants

### CORS Error
```
Access to fetch at 'http://localhost:8080/api/auth/login' from origin 'null' has been blocked by CORS policy
```

**Solution** : Le backend doit avoir la configuration CORS. Vérifie que `WebConfig.java` contient :
```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:4200", "http://127.0.0.1:5500", "*")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(false);
}
```

### Backend non démarré
```
Failed to fetch
```

**Solution** : Démarrer le backend
```bash
cd backend
mvn spring-boot:run
```

### Base de données non démarrée
```
Connection refused
```

**Solution** : Démarrer PostgreSQL
```bash
docker-compose up -d
```

---

## 🎯 Ce qui a changé dans `login.html`

### 1. Configuration API
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

### 2. Appel API réel
```javascript
const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email: identifier,
        password: password
    })
});
```

### 3. Sauvegarde des données utilisateur
```javascript
localStorage.setItem('polytech_user', JSON.stringify({
    id: userData.id,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: userData.role,
    schoolId: userData.schoolId,
    schoolName: userData.schoolName
}));
```

---

## 🚀 Prochaines étapes

1. ✅ Tester la connexion avec `dev@polyrezo.com` / `dev123`
2. ✅ Vérifier que les données sont sauvegardées dans `localStorage`
3. 📝 Créer `dashboard.html` pour afficher les infos utilisateur
4. 📝 Créer les pages pour les événements et hébergements
5. 📝 Ajouter un système de déconnexion

---

## 💡 Astuce : Serveur local pour éviter les problèmes CORS

Si tu ouvres le fichier directement (`file:///...`), tu peux avoir des problèmes CORS.

**Solution** : Utiliser un serveur local

### Avec Python
```bash
# Python 3
cd frontend/src
python -m http.server 8000

# Ouvrir http://localhost:8000/login.html
```

### Avec Node.js
```bash
# Installer http-server globalement
npm install -g http-server

# Lancer le serveur
cd frontend/src
http-server -p 8000

# Ouvrir http://localhost:8000/login.html
```

### Avec VS Code (Extension Live Server)
1. Installer l'extension "Live Server"
2. Clic droit sur `login.html`
3. "Open with Live Server"
4. S'ouvre automatiquement dans le navigateur
