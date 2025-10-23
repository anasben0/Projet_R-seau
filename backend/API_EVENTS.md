# API Event Endpoints

## 📋 Vue d'ensemble

L'API Event permet de gérer les événements Polytech (création, lecture, modification, suppression).

## 🔗 Endpoints disponibles

### 1. **Créer un événement**
```http
POST /api/events?userId=<uuid>
Content-Type: application/json
```

**Body (CreateEventRequest)**:
```json
{
  "schoolId": "uuid",
  "name": "Soirée d'intégration Lyon 2025",
  "activities": "Jeux, repas, soirée",
  "startsAt": "2025-11-15T19:00:00+01:00",
  "endsAt": "2025-11-15T23:00:00+01:00",
  "address": "Campus Lyon",
  "room": "Amphi A"
}
```

**Response** (201 Created):
```json
{
  "id": "uuid",
  "schoolId": "uuid",
  "schoolName": "Lyon",
  "name": "Soirée d'intégration Lyon 2025",
  "activities": "Jeux, repas, soirée",
  "startsAt": "2025-11-15T19:00:00+01:00",
  "endsAt": "2025-11-15T23:00:00+01:00",
  "address": "Campus Lyon",
  "room": "Amphi A",
  "createdBy": "uuid",
  "createdByName": "John Doe",
  "createdAt": "2025-10-23T17:30:00+02:00"
}
```

---

### 2. **Obtenir tous les événements** (triés par date de début)
```http
GET /api/events
```

**Response** (200 OK):
```json
[
  {
    "id": "uuid",
    "schoolId": "uuid",
    "schoolName": "Lyon",
    "name": "Soirée d'intégration Lyon 2025",
    "activities": "Jeux, repas, soirée",
    "startsAt": "2025-11-15T19:00:00+01:00",
    "endsAt": "2025-11-15T23:00:00+01:00",
    "address": "Campus Lyon",
    "room": "Amphi A",
    "createdBy": "uuid",
    "createdByName": "John Doe",
    "createdAt": "2025-10-23T17:30:00+02:00"
  }
]
```

---

### 3. **Obtenir les événements à venir uniquement**
```http
GET /api/events/upcoming
```

**Response** (200 OK): Liste des événements futurs (où `startsAt >= maintenant`)

---

### 4. **Obtenir un événement par ID**
```http
GET /api/events/{id}
```

**Response** (200 OK): Détails complets de l'événement

**Erreur** (404 Not Found):
```json
{
  "error": "Not found",
  "message": "Event not found with id: <uuid>"
}
```

---

### 5. **Obtenir les événements d'une école**
```http
GET /api/events/school/{schoolId}
```

**Response** (200 OK): Liste des événements de l'école (triés par date)

---

### 6. **Obtenir les événements à venir d'une école**
```http
GET /api/events/school/{schoolId}/upcoming
```

**Response** (200 OK): Liste des événements futurs de l'école

---

### 7. **Obtenir les événements créés par un utilisateur**
```http
GET /api/events/creator/{creatorId}
```

**Response** (200 OK): Liste des événements créés par l'utilisateur (triés par date de création, plus récents en premier)

---

### 8. **Modifier un événement**
```http
PUT /api/events/{id}?userId=<uuid>
Content-Type: application/json
```

**Body (UpdateEventRequest)** - tous les champs sont optionnels:
```json
{
  "name": "Nouveau nom",
  "activities": "Nouvelles activités",
  "startsAt": "2025-11-20T19:00:00+01:00",
  "endsAt": "2025-11-20T23:00:00+01:00",
  "address": "Nouvelle adresse",
  "room": "Nouvelle salle"
}
```

**Response** (200 OK): Événement mis à jour

**Erreurs**:
- 404 Not Found: Événement introuvable
- 403 Forbidden: Vous n'avez pas la permission de modifier cet événement (seul le créateur ou un admin peut modifier)

---

### 9. **Supprimer un événement**
```http
DELETE /api/events/{id}?userId=<uuid>
```

**Response** (200 OK):
```json
{
  "message": "Event deleted successfully"
}
```

**Erreurs**:
- 404 Not Found: Événement introuvable
- 403 Forbidden: Vous n'avez pas la permission de supprimer cet événement (seul le créateur ou un admin peut supprimer)

---

## ✅ Validations

### CreateEventRequest
- `schoolId`: **requis**, doit exister en base
- `name`: **requis**, non vide
- `startsAt`: **requis**, date et heure de début
- `endsAt`: optionnel, mais doit être après `startsAt` si fourni
- `activities`, `address`, `room`: optionnels

### UpdateEventRequest
- Tous les champs sont optionnels
- Si `endsAt` est fourni, il doit être après `startsAt`

---

## 🔒 Permissions

### Modification / Suppression
Seuls peuvent modifier ou supprimer un événement :
- Le créateur de l'événement (`createdBy`)
- Un utilisateur avec le rôle `admin`

---

## 📊 Cas d'utilisation

1. **Lister tous les événements Polytech** : `GET /api/events`
2. **Voir les prochains événements** : `GET /api/events/upcoming`
3. **Voir les événements de mon école** : `GET /api/events/school/{mySchoolId}/upcoming`
4. **Créer un événement pour mon école** : `POST /api/events?userId={myUserId}`
5. **Modifier mon événement** : `PUT /api/events/{eventId}?userId={myUserId}`
6. **Voir mes événements créés** : `GET /api/events/creator/{myUserId}`

---

## ✨ Fonctionnalités implémentées

✅ CRUD complet (Create, Read, Update, Delete)  
✅ Validation des données (Jakarta Validation)  
✅ Permissions (créateur + admin)  
✅ Filtres (à venir, par école, par créateur)  
✅ Tri automatique par date  
✅ Relations avec School et User  
✅ Enrichissement des réponses (nom école, nom créateur)  
✅ Gestion d'erreurs complète  
✅ Support CORS (Cross-Origin)  

---

## 🚀 État actuel

**Backend Event: 100% fonctionnel** ✅

Base URL: `http://localhost:8080`
