# 🚀 Quick Start - Intégration API Backend

## 📍 URL de base
```
http://localhost:8080/api
```

## 🔑 Endpoints essentiels

### 1. Inscription
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phone": "0612345678",
  "schoolId": "uuid-de-lecole"
}

Response 201:
{
  "success": true,
  "message": "Inscription réussie",
  "user": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "0612345678",
    "schoolId": "uuid-de-lecole",
    "role": "member",
    "createdAt": "2025-10-23T17:30:00Z"
  }
}
```

### 2. Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "message": "Connexion réussie",
  "user": { ... }
}
```

### 3. Liste des écoles
```http
GET /api/schools

Response 200:
[
  { "id": "uuid", "name": "Lille" },
  { "id": "uuid", "name": "Lyon" },
  ...
]
```

### 4. Événements à venir
```http
GET /api/events/upcoming

Response 200:
[
  {
    "id": "uuid",
    "schoolId": "uuid",
    "schoolName": "Lyon",
    "name": "Soirée d'intégration",
    "activities": "Jeux, repas",
    "startsAt": "2025-11-15T19:00:00+01:00",
    "endsAt": "2025-11-15T23:00:00+01:00",
    "address": "Campus Lyon",
    "room": "Amphi A",
    "createdBy": "uuid",
    "createdByName": "John Doe",
    "createdAt": "2025-10-23T17:30:00Z"
  }
]
```

### 5. Créer un événement
```http
POST /api/events?userId=uuid-utilisateur
Content-Type: application/json

{
  "schoolId": "uuid-ecole",
  "name": "Soirée d'intégration Lyon 2025",
  "activities": "Jeux, repas, soirée",
  "startsAt": "2025-11-15T19:00:00+01:00",
  "endsAt": "2025-11-15T23:00:00+01:00",
  "address": "Campus Lyon",
  "room": "Amphi A"
}

Response 201: { ... event créé ... }
```

### 6. Modifier un événement
```http
PUT /api/events/{eventId}?userId=uuid-utilisateur
Content-Type: application/json

{
  "name": "Nouveau nom",
  "activities": "Nouvelles activités"
}

Response 200: { ... event modifié ... }
```

### 7. Supprimer un événement
```http
DELETE /api/events/{eventId}?userId=uuid-utilisateur

Response 200:
{
  "message": "Event deleted successfully"
}
```

## 🛡️ Permissions

- **Modifier/Supprimer un événement** : Créateur OU Admin
- **Créer un événement** : Tout utilisateur connecté
- **Voir les événements** : Tout le monde (même non connecté)

## 📋 Liste des 16 écoles Polytech

1. Lille
2. Sorbonne
3. Paris-Saclay
4. Nancy
5. Orléans
6. Tours
7. Angers
8. Nantes
9. Dijon
10. Annecy-Chambery
11. Lyon
12. Grenoble
13. Clermont
14. Montpellier
15. Marseille
16. Nice Sophia

## 🎨 Schéma de flux utilisateur

```
1. Utilisateur non connecté
   → GET /api/schools (récupérer la liste des écoles)
   → POST /api/auth/register (s'inscrire)
   → Rediriger vers liste événements

2. Utilisateur connecté
   → GET /api/events/upcoming (voir événements à venir)
   → POST /api/events?userId={id} (créer un événement)
   → GET /api/events/creator/{userId} (voir ses événements)
   → PUT /api/events/{id}?userId={userId} (modifier son événement)
   → DELETE /api/events/{id}?userId={userId} (supprimer son événement)

3. Admin
   → Peut modifier/supprimer tous les événements
   → POST /api/schools (créer une école)
```

## ⚡ Code minimal Angular

### Service d'authentification (auth.service.ts)
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.API}/register`, data);
  }

  login(credentials: any) {
    return this.http.post(`${this.API}/login`, credentials);
  }
}
```

### Service événements (event.service.ts)
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class EventService {
  private API = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) {}

  getUpcoming() {
    return this.http.get(`${this.API}/upcoming`);
  }

  create(event: any, userId: string) {
    const params = new HttpParams().set('userId', userId);
    return this.http.post(this.API, event, { params });
  }

  delete(eventId: string, userId: string) {
    const params = new HttpParams().set('userId', userId);
    return this.http.delete(`${this.API}/${eventId}`, { params });
  }
}
```

## 🧪 Tester avec cURL

### Inscription
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "test123",
    "schoolId": "uuid-ecole"
  }'
```

### Liste événements
```bash
curl http://localhost:8080/api/events/upcoming
```

### Créer événement
```bash
curl -X POST "http://localhost:8080/api/events?userId=uuid-user" \
  -H "Content-Type: application/json" \
  -d '{
    "schoolId": "uuid-ecole",
    "name": "Test Event",
    "startsAt": "2025-12-01T19:00:00+01:00"
  }'
```

## 📚 Documentation complète

- **Guide complet** : `INTEGRATION_FRONTEND.md`
- **API Auth** : `API_AUTH.md`
- **API Events** : `API_EVENTS.md`

## ✅ À faire

1. [ ] Configurer HttpClientModule dans Angular
2. [ ] Créer les 3 services (auth, school, event)
3. [ ] Créer les composants (login, register, events)
4. [ ] Tester les appels API
5. [ ] Gérer les erreurs
6. [ ] Stocker l'utilisateur connecté (localStorage)

## 🆘 En cas de problème

1. Vérifier que le backend tourne : http://localhost:8080
2. Ouvrir la console navigateur (F12)
3. Vérifier le CORS (déjà configuré pour localhost:4200)
4. Contacter le dev backend 😊
