# 🧪 Collection Postman - API Polyrezo

Ce fichier contient une collection Postman complète pour tester tous les endpoints de l'API.

## 📥 Importer dans Postman

1. Ouvrir Postman
2. Cliquer sur "Import"
3. Copier-coller le JSON ci-dessous
4. Cliquer sur "Import"

---

## 📋 Collection JSON (à copier dans Postman)

```json
{
  "info": {
    "name": "Polyrezo API",
    "description": "Collection complète pour tester l'API Backend Polyrezo",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8080/api"
    },
    {
      "key": "userId",
      "value": ""
    },
    {
      "key": "schoolId",
      "value": ""
    },
    {
      "key": "eventId",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"email\": \"john.doe@example.com\",\n  \"password\": \"password123\",\n  \"phone\": \"0612345678\",\n  \"schoolId\": \"{{schoolId}}\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john.doe@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Schools",
      "item": [
        {
          "name": "Get All Schools",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/schools",
              "host": ["{{baseUrl}}"],
              "path": ["schools"]
            }
          }
        },
        {
          "name": "Get School By ID",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/schools/{{schoolId}}",
              "host": ["{{baseUrl}}"],
              "path": ["schools", "{{schoolId}}"]
            }
          }
        },
        {
          "name": "Create School (Admin)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test School\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/schools",
              "host": ["{{baseUrl}}"],
              "path": ["schools"]
            }
          }
        }
      ]
    },
    {
      "name": "Events",
      "item": [
        {
          "name": "Get All Events",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/events",
              "host": ["{{baseUrl}}"],
              "path": ["events"]
            }
          }
        },
        {
          "name": "Get Upcoming Events",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/events/upcoming",
              "host": ["{{baseUrl}}"],
              "path": ["events", "upcoming"]
            }
          }
        },
        {
          "name": "Get Event By ID",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/events/{{eventId}}",
              "host": ["{{baseUrl}}"],
              "path": ["events", "{{eventId}}"]
            }
          }
        },
        {
          "name": "Get Events By School",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/events/school/{{schoolId}}",
              "host": ["{{baseUrl}}"],
              "path": ["events", "school", "{{schoolId}}"]
            }
          }
        },
        {
          "name": "Get Upcoming Events By School",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/events/school/{{schoolId}}/upcoming",
              "host": ["{{baseUrl}}"],
              "path": ["events", "school", "{{schoolId}}", "upcoming"]
            }
          }
        },
        {
          "name": "Get Events By Creator",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/events/creator/{{userId}}",
              "host": ["{{baseUrl}}"],
              "path": ["events", "creator", "{{userId}}"]
            }
          }
        },
        {
          "name": "Create Event",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"schoolId\": \"{{schoolId}}\",\n  \"name\": \"Soirée d'intégration Lyon 2025\",\n  \"activities\": \"Jeux, repas, soirée\",\n  \"startsAt\": \"2025-11-15T19:00:00+01:00\",\n  \"endsAt\": \"2025-11-15T23:00:00+01:00\",\n  \"address\": \"Campus Lyon\",\n  \"room\": \"Amphi A\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/events?userId={{userId}}",
              "host": ["{{baseUrl}}"],
              "path": ["events"],
              "query": [
                {
                  "key": "userId",
                  "value": "{{userId}}"
                }
              ]
            }
          }
        },
        {
          "name": "Update Event",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Nouveau nom de l'événement\",\n  \"activities\": \"Nouvelles activités\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/events/{{eventId}}?userId={{userId}}",
              "host": ["{{baseUrl}}"],
              "path": ["events", "{{eventId}}"],
              "query": [
                {
                  "key": "userId",
                  "value": "{{userId}}"
                }
              ]
            }
          }
        },
        {
          "name": "Delete Event",
          "request": {
            "method": "DELETE",
            "url": {
              "raw": "{{baseUrl}}/events/{{eventId}}?userId={{userId}}",
              "host": ["{{baseUrl}}"],
              "path": ["events", "{{eventId}}"],
              "query": [
                {
                  "key": "userId",
                  "value": "{{userId}}"
                }
              ]
            }
          }
        }
      ]
    }
  ]
}
```

---

## 🔧 Configuration des variables

Après import, configurer les variables d'environnement :

1. Cliquer sur l'icône ⚙️ en haut à droite
2. Aller dans "Variables"
3. Définir les valeurs :

| Variable | Valeur initiale | Description |
|----------|----------------|-------------|
| `baseUrl` | `http://localhost:8080/api` | URL de base de l'API |
| `userId` | (vide) | À remplir après connexion |
| `schoolId` | (vide) | À récupérer depuis GET /schools |
| `eventId` | (vide) | À récupérer après création d'un événement |

---

## 📝 Scénario de test complet

### 1️⃣ Récupérer la liste des écoles
```
GET {{baseUrl}}/schools
```
→ Copier un `id` d'école et le mettre dans la variable `schoolId`

### 2️⃣ S'inscrire
```
POST {{baseUrl}}/auth/register
Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phone": "0612345678",
  "schoolId": "{{schoolId}}"
}
```
→ Copier `user.id` de la réponse et le mettre dans la variable `userId`

### 3️⃣ Se connecter
```
POST {{baseUrl}}/auth/login
Body:
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```
→ Vérifier que `success: true`

### 4️⃣ Voir les événements à venir
```
GET {{baseUrl}}/events/upcoming
```
→ Devrait retourner une liste (vide si aucun événement)

### 5️⃣ Créer un événement
```
POST {{baseUrl}}/events?userId={{userId}}
Body:
{
  "schoolId": "{{schoolId}}",
  "name": "Test Event",
  "activities": "Testing",
  "startsAt": "2025-12-01T19:00:00+01:00",
  "address": "Test Address",
  "room": "Room 101"
}
```
→ Copier `id` de la réponse et le mettre dans la variable `eventId`

### 6️⃣ Voir tous les événements
```
GET {{baseUrl}}/events
```
→ Votre événement devrait apparaître

### 7️⃣ Modifier l'événement
```
PUT {{baseUrl}}/events/{{eventId}}?userId={{userId}}
Body:
{
  "name": "Updated Event Name",
  "activities": "Updated activities"
}
```

### 8️⃣ Voir mes événements
```
GET {{baseUrl}}/events/creator/{{userId}}
```

### 9️⃣ Supprimer l'événement
```
DELETE {{baseUrl}}/events/{{eventId}}?userId={{userId}}
```

### 🔟 Vérifier la suppression
```
GET {{baseUrl}}/events
```
→ L'événement ne devrait plus apparaître

---

## 🎯 Tests avancés

### Test des permissions
```
# Essayer de modifier un événement créé par quelqu'un d'autre
PUT {{baseUrl}}/events/{autre-eventId}?userId={{userId}}

# Devrait retourner 403 Forbidden
```

### Test des validations
```
# Essayer de créer un événement sans nom
POST {{baseUrl}}/events?userId={{userId}}
Body:
{
  "schoolId": "{{schoolId}}",
  "startsAt": "2025-12-01T19:00:00+01:00"
}

# Devrait retourner 400 Bad Request avec détails des champs manquants
```

### Test des dates invalides
```
# Créer un événement avec endsAt avant startsAt
POST {{baseUrl}}/events?userId={{userId}}
Body:
{
  "schoolId": "{{schoolId}}",
  "name": "Invalid Event",
  "startsAt": "2025-12-01T19:00:00+01:00",
  "endsAt": "2025-12-01T18:00:00+01:00"
}

# Devrait retourner 400 Bad Request : "End date must be after start date"
```

---

## 💡 Astuces Postman

### Scripts de test automatiques

Ajouter dans l'onglet "Tests" de la requête Register :
```javascript
// Sauvegarder automatiquement le userId
if (pm.response.code === 201) {
    const response = pm.response.json();
    if (response.user && response.user.id) {
        pm.collectionVariables.set("userId", response.user.id);
        console.log("userId saved:", response.user.id);
    }
}
```

Ajouter dans l'onglet "Tests" de la requête Get All Schools :
```javascript
// Sauvegarder automatiquement le premier schoolId
if (pm.response.code === 200) {
    const schools = pm.response.json();
    if (schools.length > 0) {
        pm.collectionVariables.set("schoolId", schools[0].id);
        console.log("schoolId saved:", schools[0].id);
    }
}
```

Ajouter dans l'onglet "Tests" de la requête Create Event :
```javascript
// Sauvegarder automatiquement l'eventId
if (pm.response.code === 201) {
    const event = pm.response.json();
    if (event.id) {
        pm.collectionVariables.set("eventId", event.id);
        console.log("eventId saved:", event.id);
    }
}
```

---

## 🐛 Résolution de problèmes

### Erreur CORS
Si vous avez une erreur CORS, vérifier que :
- Le backend tourne sur `http://localhost:8080`
- Le frontend (si lancé) tourne sur `http://localhost:4200`
- Postman ne devrait pas avoir de problème CORS

### Erreur 401 Unauthorized
- Vérifier que vous utilisez le bon `userId` dans les paramètres
- Vérifier que l'utilisateur existe bien en base

### Erreur 403 Forbidden
- Vous essayez de modifier/supprimer un événement qui n'est pas le vôtre
- Seul le créateur ou un admin peut modifier/supprimer

### Erreur 404 Not Found
- L'ID fourni n'existe pas
- Vérifier que vous avez bien mis à jour les variables `eventId`, `schoolId`, etc.

---

## 📚 Documentation complète

- **Guide d'intégration** : `INTEGRATION_FRONTEND.md`
- **Quick Start** : `QUICK_START_FRONTEND.md`
- **API Auth** : `API_AUTH.md`
- **API Events** : `API_EVENTS.md`
