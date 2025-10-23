# API d'Authentification - Backend PolyRezo

## 📋 Vue d'ensemble

Cette API REST fournit les fonctionnalités d'inscription et de connexion pour l'application PolyRezo.

## 🚀 Endpoints

### Base URL
```
http://localhost:8080/api
```

## 📝 Endpoints d'Authentification

### 1. Inscription (Register)

Crée un nouveau compte utilisateur.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "schoolId": "uuid-de-l-ecole",
  "phone": "+33612345678"
}
```

**Champs requis:**
- `firstName` : Prénom (obligatoire)
- `lastName` : Nom (obligatoire)
- `email` : Email valide (obligatoire, unique)
- `password` : Mot de passe (obligatoire, minimum 6 caractères)
- `schoolId` : UUID de l'école (obligatoire)
- `phone` : Numéro de téléphone (optionnel)

**Réponse Success (201 Created):**
```json
{
  "success": true,
  "message": "Inscription réussie",
  "user": {
    "id": "uuid-de-l-utilisateur",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+33612345678",
    "schoolId": "uuid-de-l-ecole",
    "role": "member",
    "createdAt": "2025-10-23T15:30:00Z"
  }
}
```

**Réponse Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "Cet email est déjà utilisé"
}
```

---

### 2. Connexion (Login)

Authentifie un utilisateur existant.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Champs requis:**
- `email` : Email valide (obligatoire)
- `password` : Mot de passe (obligatoire)

**Réponse Success (200 OK):**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "user": {
    "id": "uuid-de-l-utilisateur",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+33612345678",
    "schoolId": "uuid-de-l-ecole",
    "role": "member",
    "createdAt": "2025-10-23T15:30:00Z"
  }
}
```

**Réponse Error (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Email ou mot de passe incorrect"
}
```

---

## 📚 Endpoints des Écoles

### 3. Liste des Écoles

Récupère toutes les écoles disponibles.

**Endpoint:** `GET /api/schools`

**Réponse Success (200 OK):**
```json
[
  {
    "id": "uuid-ecole-1",
    "name": "École Polytechnique"
  },
  {
    "id": "uuid-ecole-2",
    "name": "Centrale Paris"
  }
]
```

---

### 4. Créer une École

Crée une nouvelle école (à utiliser pour l'initialisation).

**Endpoint:** `POST /api/schools`

**Request Body:**
```json
{
  "name": "École Polytechnique"
}
```

**Réponse Success (200 OK):**
```json
{
  "id": "uuid-de-l-ecole",
  "name": "École Polytechnique"
}
```

---

## 🔒 Sécurité

- Les mots de passe sont hachés avec **BCrypt** avant d'être stockés
- Le mot de passe n'est jamais renvoyé dans les réponses API
- Validation des données côté serveur avec Jakarta Bean Validation

## 🗄️ Base de Données

### Configuration
- **Type:** PostgreSQL 18
- **Port:** 5433
- **Database:** polyrezo_db
- **User:** polyrezo_user

### Types ENUM
- **user_role:** `member`, `admin`
- **request_status:** `requested`, `accepted`, `declined`

## ⚙️ Configuration

Les identifiants de base de données sont configurés via des variables d'environnement :

```properties
DB_URL=jdbc:postgresql://localhost:5433/polyrezo_db
DB_USERNAME=polyrezo_user
DB_PASSWORD=SecurePassword@2025!
```

## 🧪 Tester l'API

### Avec cURL

**Inscription:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "schoolId": "uuid-de-l-ecole"
  }'
```

**Connexion:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

**Liste des écoles:**
```bash
curl http://localhost:8080/api/schools
```

## 📦 Stack Technique

- **Framework:** Spring Boot 3.5.6
- **Java:** 21
- **Base de données:** PostgreSQL 18
- **ORM:** Hibernate / JPA
- **Migration:** Flyway
- **Sécurité:** Spring Security (BCrypt)
- **Validation:** Jakarta Bean Validation

## 🚀 Démarrage

1. Démarrer le container PostgreSQL:
```bash
docker start db
```

2. Lancer l'application:
```bash
cd backend
mvn spring-boot:run
```

3. L'API est disponible sur: `http://localhost:8080`

## ✅ Fonctionnalités Implémentées

- ✅ Inscription utilisateur avec validation
- ✅ Connexion utilisateur
- ✅ Hachage sécurisé des mots de passe
- ✅ Gestion des écoles
- ✅ Validation des données
- ✅ Gestion des erreurs
- ✅ Types ENUM PostgreSQL
- ✅ Migration de base de données automatique

## 📝 Notes

- Par défaut, tous les nouveaux utilisateurs ont le rôle `member`
- Les emails doivent être uniques dans le système
- Le mot de passe doit contenir au moins 6 caractères
