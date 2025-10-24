# 🎉 Frontend Angular - Événements Polytech

## ✅ Ce qui a été fait

### **Architecture Angular moderne**
- ✅ **Composants standalone** (plus besoin de NgModule)
- ✅ **Reactive Forms** pour la validation
- ✅ **Services centralisés** pour les appels API
- ✅ **Routing** entre Login et Register
- ✅ **HttpClient** configuré avec `withFetch()`
- ✅ **TypeScript strict** pour la sécurité du code

---

## 📁 Structure créée

```
frontend/src/app/
├── models/
│   └── user.model.ts            # Interfaces TypeScript
├── services/
│   ├── auth.service.ts          # Service d'authentification
│   └── school.service.ts        # Service des écoles
├── components/
│   ├── login/
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   └── login.component.css
│   └── register/
│       ├── register.component.ts
│       ├── register.component.html
│       └── register.component.css
├── app.routes.ts                # Configuration des routes
├── app.config.ts                # Configuration de l'app (HttpClient)
└── app.html                     # Template principal (router-outlet)
```

---

## 🚀 Démarrage

### 1. Backend (Terminal 1)
```bash
# Démarrer PostgreSQL
docker-compose up -d

# Démarrer le backend Spring Boot
cd backend
mvn spring-boot:run
```

### 2. Frontend (Terminal 2)
```bash
cd frontend
npm install
ng serve
```

### 3. Ouvrir le navigateur
```
http://localhost:4200
```

---

## 🎯 Fonctionnalités

### ✅ Page de connexion (`/login`)
- Email + mot de passe
- Validation formulaire
- Appel API `POST /api/auth/login`
- Sauvegarde utilisateur dans `localStorage`
- Redirection vers `/dashboard`
- Pas de distinction utilisateur/admin (connexion unique)

### ✅ Page d'inscription (`/register`)
- Prénom, nom, email, téléphone (optionnel)
- Sélection de l'école (16 écoles Polytech)
- Mot de passe + confirmation
- Validation formulaire (email, longueur, correspondance mots de passe)
- Appel API `POST /api/auth/register`
- Redirection automatique après inscription

---

## 🔧 Services Angular

### **AuthService** (`services/auth.service.ts`)
```typescript
// Connexion
login(request: LoginRequest): Observable<AuthResponse>

// Inscription
register(request: RegisterRequest): Observable<AuthResponse>

// Déconnexion
logout(): void

// Vérifier si connecté
isAuthenticated(): boolean

// Vérifier si admin
isAdmin(): boolean

// Obtenir l'utilisateur actuel
getCurrentUser(): User | null
```

### **SchoolService** (`services/school.service.ts`)
```typescript
// Récupérer toutes les écoles
getAllSchools(): Observable<School[]>

// Récupérer une école par ID
getSchoolById(id: string): Observable<School>
```

---

## 📝 Modèles TypeScript

### **User**
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  schoolId: string;
  role: 'admin' | 'member';
  createdAt: string;
}
```

### **AuthResponse**
```typescript
interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}
```

---

## 🎨 Validation formulaires

### **Connexion**
- ✅ Email requis et format valide
- ✅ Mot de passe requis (min 6 caractères)
- ✅ Messages d'erreur dynamiques
- ✅ Désactivation bouton si formulaire invalide

### **Inscription**
- ✅ Prénom/nom requis (min 2 caractères)
- ✅ Email requis et format valide
- ✅ École requise (chargée depuis l'API)
- ✅ Mot de passe requis (min 6 caractères)
- ✅ Confirmation mot de passe (doit correspondre)
- ✅ Téléphone optionnel

---

## 🔐 Gestion de session

### **localStorage**
```javascript
// Données sauvegardées après connexion/inscription
{
  "id": "uuid",
  "email": "user@polytech.fr",
  "firstName": "Jean",
  "lastName": "Dupont",
  "role": "member",
  "schoolId": "uuid-school",
  "phone": "0612345678",
  "createdAt": "2025-10-24T..."
}
```

### **BehaviorSubject**
Le service `AuthService` utilise un `BehaviorSubject` pour :
- Partager l'état utilisateur dans toute l'app
- Permettre aux composants de s'abonner aux changements
- Vérifier la connexion en temps réel

---

## 🛣️ Routes configurées

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | → `/login` | Redirection racine |
| `/login` | `LoginComponent` | Page de connexion |
| `/register` | `RegisterComponent` | Page d'inscription |
| `/**` | → `/login` | Redirection routes inconnues |

---

## 🧪 Tester l'application

### 1. Inscription nouvel utilisateur
```
http://localhost:4200/register

- Remplir le formulaire
- Sélectionner une école
- Cliquer "S'inscrire"
→ Redirection automatique vers /dashboard
```

### 2. Connexion utilisateur existant
```
http://localhost:4200/login

Admin test :
- Email : dev@polyrezo.com
- Mot de passe : dev123
→ Connexion réussie
```

---

## 🎨 Design

- **Gradient violet/bleu** : Identité visuelle moderne
- **Animations CSS** : Transitions douces
- **Responsive** : Adapté mobile/tablette/desktop
- **Validation visuelle** : Bordures rouges pour erreurs
- **Loading states** : Spinners pendant les requêtes
- **Messages** : Succès (vert) et erreur (rouge)

---

## 🔄 Flux utilisateur

### **Inscription**
```
1. Utilisateur arrive sur /register
2. Remplit le formulaire (validation temps réel)
3. Clique "S'inscrire"
4. → POST /api/auth/register
5. ✅ Succès : Utilisateur sauvegardé dans localStorage
6. → Redirection /dashboard (à créer)
```

### **Connexion**
```
1. Utilisateur arrive sur /login
2. Entre email + mot de passe
3. Clique "Se connecter"
4. → POST /api/auth/login
5. ✅ Succès : Utilisateur sauvegardé dans localStorage
6. → Redirection /dashboard (à créer)
```

---

## 📦 Prochaines étapes

### **À créer**
- [ ] Composant Dashboard
- [ ] Composant Événements (liste, création, détails)
- [ ] Composant Hébergements (liste, rejoindre, quitter)
- [ ] Guard pour protéger les routes (AuthGuard)
- [ ] Guard pour routes admin (AdminGuard)
- [ ] Intercepteur HTTP pour gérer les erreurs
- [ ] Service Events
- [ ] Service Accommodations

---

## 🐛 Dépannage

### **Le backend ne répond pas**
```bash
# Vérifier que le backend tourne
curl http://localhost:8080/api/schools

# Redémarrer si nécessaire
cd backend && mvn spring-boot:run
```

### **Erreur CORS**
Le backend doit avoir `WebConfig.java` avec :
```java
registry.addMapping("/api/**")
    .allowedOrigins("http://localhost:4200")
    .allowedMethods("GET", "POST", "PUT", "DELETE")
    .allowedHeaders("*");
```

### **Erreur compilation Angular**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
ng serve
```

---

## 🎉 Résumé

✅ **Application Angular moderne** avec :
- Composants standalone
- Reactive Forms
- Services HTTP
- Routing
- Validation complète
- Design professionnel

✅ **Une seule page de connexion** (pas de distinction utilisateur/admin)

✅ **Page d'inscription** avec sélection d'école

✅ **Appels API fonctionnels** vers Spring Boot

✅ **Prêt pour le développement** des fonctionnalités métier (événements, hébergements)
