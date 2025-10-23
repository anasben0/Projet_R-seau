# 🏠 API Accommodations (Hébergements)

Documentation complète de l'API pour gérer les hébergements proposés lors des événements.

---

## 📋 Vue d'ensemble

Les hébergements permettent aux utilisateurs de :
- **Proposer** un hébergement pour un événement (host)
- **Rejoindre** un hébergement disponible (guest)
- **Visualiser** les hébergements disponibles
- **Gérer** leurs propres hébergements

### 🔐 Permissions
- **Host uniquement** : Créer, modifier, supprimer ses hébergements
- **Tous** : Voir les hébergements, rejoindre, quitter

---

## 🎯 Endpoints

### 1. Créer un hébergement
```http
POST /api/accommodations?hostId={uuid}
Content-Type: application/json

{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Appartement 3 chambres",
  "address": "15 rue de la Paix, Lyon",
  "contact": "06 12 34 56 78",
  "capacity": 4
}
```

**Réponse (201 Created)** :
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "eventName": "Soirée d'intégration Lyon 2025",
  "hostId": "770e8400-e29b-41d4-a716-446655440002",
  "hostName": "John Doe",
  "title": "Appartement 3 chambres",
  "address": "15 rue de la Paix, Lyon",
  "contact": "06 12 34 56 78",
  "capacity": 4,
  "availableSpots": 4,
  "acceptedGuests": 0,
  "createdAt": "2025-10-23T17:00:00+01:00"
}
```

**Validations** :
- `eventId` : obligatoire, doit exister
- `address` : obligatoire, non vide
- `capacity` : obligatoire, >= 1
- `title` : optionnel
- `contact` : optionnel

---

### 2. Récupérer tous les hébergements
```http
GET /api/accommodations
```

**Réponse (200 OK)** :
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "eventId": "550e8400-e29b-41d4-a716-446655440000",
    "eventName": "Soirée d'intégration Lyon 2025",
    "hostId": "770e8400-e29b-41d4-a716-446655440002",
    "hostName": "John Doe",
    "title": "Appartement 3 chambres",
    "address": "15 rue de la Paix, Lyon",
    "contact": "06 12 34 56 78",
    "capacity": 4,
    "availableSpots": 2,
    "acceptedGuests": 2,
    "createdAt": "2025-10-23T17:00:00+01:00"
  }
]
```

---

### 3. Récupérer les hébergements d'un événement
```http
GET /api/accommodations/event/{eventId}
```

**Exemple** :
```bash
GET /api/accommodations/event/550e8400-e29b-41d4-a716-446655440000
```

**Réponse (200 OK)** : Liste des hébergements pour cet événement

---

### 4. Récupérer les hébergements disponibles d'un événement
```http
GET /api/accommodations/event/{eventId}/available
```

Retourne uniquement les hébergements avec `availableSpots > 0`.

**Exemple** :
```bash
GET /api/accommodations/event/550e8400-e29b-41d4-a716-446655440000/available
```

---

### 5. Récupérer les hébergements créés par un host
```http
GET /api/accommodations/host/{hostId}
```

**Exemple** :
```bash
GET /api/accommodations/host/770e8400-e29b-41d4-a716-446655440002
```

---

### 6. Récupérer un hébergement par son ID
```http
GET /api/accommodations/{id}
```

**Réponse (200 OK)** : Détails de l'hébergement

**Réponse (404 Not Found)** : Hébergement introuvable

---

### 7. Modifier un hébergement (host uniquement)
```http
PUT /api/accommodations/{id}?hostId={uuid}
Content-Type: application/json

{
  "title": "Grand appartement rénové",
  "capacity": 5
}
```

**Réponse (200 OK)** : Hébergement mis à jour

**Réponse (403 Forbidden)** : Vous n'êtes pas le créateur

**Règles** :
- Seul le **host** peut modifier
- Tous les champs sont optionnels
- La capacité ne peut pas être réduite en dessous du nombre d'invités acceptés

**Exemple d'erreur** :
```json
// Si capacity = 3 et acceptedGuests = 4
{
  "error": "Cannot reduce capacity below the number of accepted guests (4)"
}
```

---

### 8. Supprimer un hébergement (host uniquement)
```http
DELETE /api/accommodations/{id}?hostId={uuid}
```

**Réponse (204 No Content)** : Suppression réussie

**Réponse (403 Forbidden)** : Vous n'êtes pas le créateur

**Réponse (404 Not Found)** : Hébergement introuvable

---

### 9. Rejoindre un hébergement
```http
POST /api/accommodations/{id}/join?guestId={uuid}
```

**Réponse (200 OK)** :
```json
{
  "message": "Successfully joined the accommodation"
}
```

**Réponse (409 Conflict)** : Hébergement complet
```json
{
  "error": "This accommodation is full"
}
```

**Réponse (400 Bad Request)** : Erreurs possibles
```json
{
  "error": "You already have a request for this accommodation"
}
// ou
{
  "error": "You cannot join your own accommodation"
}
```

**Règles** :
- Acceptation automatique (pas de validation manuelle)
- Un utilisateur ne peut pas rejoindre son propre hébergement
- Un utilisateur ne peut rejoindre qu'une seule fois
- Vérifie la capacité disponible

---

### 10. Quitter un hébergement
```http
DELETE /api/accommodations/{id}/leave?guestId={uuid}
```

**Réponse (200 OK)** :
```json
{
  "message": "Successfully left the accommodation"
}
```

**Réponse (400 Bad Request)** :
```json
{
  "error": "Guest not found in this accommodation"
}
```

---

### 11. Récupérer la liste des invités d'un hébergement
```http
GET /api/accommodations/{id}/guests
```

**Réponse (200 OK)** :
```json
[
  {
    "guestId": "880e8400-e29b-41d4-a716-446655440003",
    "guestName": "Jane Smith",
    "guestEmail": "jane.smith@example.com",
    "status": "accepted",
    "requestedAt": "2025-10-23T18:00:00+01:00"
  },
  {
    "guestId": "990e8400-e29b-41d4-a716-446655440004",
    "guestName": "Bob Martin",
    "guestEmail": "bob.martin@example.com",
    "status": "accepted",
    "requestedAt": "2025-10-23T18:30:00+01:00"
  }
]
```

---

### 12. Récupérer mes hébergements (où je suis invité)
```http
GET /api/accommodations/my-accommodations?guestId={uuid}
```

**Réponse (200 OK)** : Liste des hébergements où l'utilisateur est invité

---

## 🔍 Cas d'usage typiques

### Scénario 1 : Host propose un hébergement

1. **Créer l'hébergement**
```bash
POST /api/accommodations?hostId=770e8400-e29b-41d4-a716-446655440002
{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Appartement Lyon Centre",
  "address": "15 rue de la Paix, Lyon",
  "contact": "06 12 34 56 78",
  "capacity": 3
}
```

2. **Voir mes hébergements**
```bash
GET /api/accommodations/host/770e8400-e29b-41d4-a716-446655440002
```

3. **Voir qui a rejoint**
```bash
GET /api/accommodations/660e8400-e29b-41d4-a716-446655440001/guests
```

---

### Scénario 2 : Guest cherche un hébergement

1. **Voir les hébergements disponibles pour un événement**
```bash
GET /api/accommodations/event/550e8400-e29b-41d4-a716-446655440000/available
```

2. **Rejoindre un hébergement**
```bash
POST /api/accommodations/660e8400-e29b-41d4-a716-446655440001/join?guestId=880e8400-e29b-41d4-a716-446655440003
```

3. **Voir mes hébergements**
```bash
GET /api/accommodations/my-accommodations?guestId=880e8400-e29b-41d4-a716-446655440003
```

---

### Scénario 3 : Host modifie son hébergement

1. **Modifier la capacité**
```bash
PUT /api/accommodations/660e8400-e29b-41d4-a716-446655440001?hostId=770e8400-e29b-41d4-a716-446655440002
{
  "capacity": 4
}
```

2. **Supprimer l'hébergement**
```bash
DELETE /api/accommodations/660e8400-e29b-41d4-a716-446655440001?hostId=770e8400-e29b-41d4-a716-446655440002
```

---

## 📊 Modèle de données

### AccommodationResponse
```typescript
interface AccommodationResponse {
  id: string;                 // UUID de l'hébergement
  eventId: string;            // UUID de l'événement
  eventName: string;          // Nom de l'événement
  hostId: string;             // UUID du host
  hostName: string;           // Nom complet du host
  title: string | null;       // Titre optionnel
  address: string;            // Adresse
  contact: string | null;     // Contact optionnel
  capacity: number;           // Capacité totale
  availableSpots: number;     // Places disponibles
  acceptedGuests: number;     // Nombre d'invités acceptés
  createdAt: string;          // ISO 8601
}
```

### GuestResponse
```typescript
interface GuestResponse {
  guestId: string;            // UUID de l'invité
  guestName: string;          // Nom complet
  guestEmail: string;         // Email
  status: string;             // "accepted"
  requestedAt: string;        // ISO 8601
}
```

---

## ⚠️ Règles métier importantes

### Capacité
- La capacité doit être >= 1
- La capacité ne peut pas être réduite en dessous du nombre d'invités acceptés
- Le trigger PostgreSQL `enforce_accommodation_capacity` empêche le surbooking

### Permissions
- Seul le **host** peut modifier ou supprimer son hébergement
- Tout le monde peut voir les hébergements publics
- Tout le monde peut rejoindre un hébergement disponible

### Auto-acceptation
- Les demandes sont **automatiquement acceptées** (pas de validation manuelle)
- Statut toujours `accepted` lors du join

### Unicité
- Un utilisateur ne peut rejoindre un hébergement qu'une seule fois
- Un host ne peut pas rejoindre son propre hébergement
- Contrainte unique en base : `(event_id, host_id, title)`

---

## 🐛 Gestion des erreurs

| Code | Message | Cause |
|------|---------|-------|
| 400 | Event not found | eventId invalide |
| 400 | User not found | userId invalide |
| 400 | You already have a request | Double join |
| 400 | You cannot join your own accommodation | Host essaie de rejoindre |
| 400 | Cannot reduce capacity below... | Capacité < invités acceptés |
| 403 | Only the host can update/delete | Tentative de modification par non-host |
| 404 | Accommodation not found | ID invalide |
| 409 | This accommodation is full | Capacité atteinte |

---

## 🧪 Tests avec curl

### Créer un hébergement
```bash
curl -X POST http://localhost:8080/api/accommodations?hostId=770e8400-e29b-41d4-a716-446655440002 \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Appartement Lyon",
    "address": "15 rue de la Paix",
    "contact": "0612345678",
    "capacity": 3
  }'
```

### Voir les hébergements disponibles
```bash
curl http://localhost:8080/api/accommodations/event/550e8400-e29b-41d4-a716-446655440000/available
```

### Rejoindre un hébergement
```bash
curl -X POST http://localhost:8080/api/accommodations/660e8400-e29b-41d4-a716-446655440001/join?guestId=880e8400-e29b-41d4-a716-446655440003
```

### Voir les invités
```bash
curl http://localhost:8080/api/accommodations/660e8400-e29b-41d4-a716-446655440001/guests
```

---

## 📚 Voir aussi

- **API_AUTH.md** - Documentation authentification
- **API_EVENTS.md** - Documentation événements
- **INTEGRATION_FRONTEND.md** - Guide d'intégration frontend
