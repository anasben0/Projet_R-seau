# 🔗 Guide d'intégration Frontend - API Backend Polyrezo

## 📋 Table des matières
1. [Configuration générale](#configuration-générale)
2. [Service d'authentification](#service-dauthentification)
3. [Service des écoles](#service-des-écoles)
4. [Service des événements](#service-des-événements)
5. [Gestion des erreurs](#gestion-des-erreurs)
6. [Exemples de composants](#exemples-de-composants)

---

## Configuration générale

### URL de base
```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Headers HTTP requis
```typescript
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};
```

### CORS
Le backend accepte les requêtes depuis `http://localhost:4200` (Angular).

---

## Service d'authentification

### 📁 Fichier: `auth.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  schoolId: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  schoolId: string;
  role: 'member' | 'admin';
  createdAt: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserData;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<UserData | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Charger l'utilisateur depuis le localStorage au démarrage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data)
      .pipe(
        tap(response => {
          if (response.success && response.user) {
            this.setCurrentUser(response.user);
          }
        })
      );
  }

  /**
   * Connexion d'un utilisateur
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.user) {
            this.setCurrentUser(response.user);
          }
        })
      );
  }

  /**
   * Déconnexion
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Obtenir l'utilisateur actuel
   */
  getCurrentUser(): UserData | null {
    return this.currentUserSubject.value;
  }

  /**
   * Vérifier si l'utilisateur est admin
   */
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  /**
   * Stocker l'utilisateur connecté
   */
  private setCurrentUser(user: UserData): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
```

---

## Service des écoles

### 📁 Fichier: `school.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface School {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private readonly API_URL = 'http://localhost:8080/api/schools';

  constructor(private http: HttpClient) {}

  /**
   * Récupérer toutes les écoles Polytech
   */
  getAllSchools(): Observable<School[]> {
    return this.http.get<School[]>(this.API_URL);
  }

  /**
   * Récupérer une école par ID
   */
  getSchoolById(id: string): Observable<School> {
    return this.http.get<School>(`${this.API_URL}/${id}`);
  }

  /**
   * Créer une nouvelle école (admin uniquement)
   */
  createSchool(name: string): Observable<School> {
    return this.http.post<School>(this.API_URL, { name });
  }
}
```

---

## Service des événements

### 📁 Fichier: `event.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface CreateEventRequest {
  schoolId: string;
  name: string;
  activities?: string;
  startsAt: string; // ISO 8601 format: "2025-11-15T19:00:00+01:00"
  endsAt?: string;
  address?: string;
  room?: string;
}

interface UpdateEventRequest {
  name?: string;
  activities?: string;
  startsAt?: string;
  endsAt?: string;
  address?: string;
  room?: string;
}

interface EventResponse {
  id: string;
  schoolId: string;
  schoolName: string;
  name: string;
  activities: string | null;
  startsAt: string;
  endsAt: string | null;
  address: string | null;
  room: string | null;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly API_URL = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) {}

  /**
   * Récupérer tous les événements (triés par date)
   */
  getAllEvents(): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(this.API_URL);
  }

  /**
   * Récupérer uniquement les événements à venir
   */
  getUpcomingEvents(): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${this.API_URL}/upcoming`);
  }

  /**
   * Récupérer un événement par ID
   */
  getEventById(id: string): Observable<EventResponse> {
    return this.http.get<EventResponse>(`${this.API_URL}/${id}`);
  }

  /**
   * Récupérer les événements d'une école
   */
  getEventsBySchool(schoolId: string): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${this.API_URL}/school/${schoolId}`);
  }

  /**
   * Récupérer les événements à venir d'une école
   */
  getUpcomingEventsBySchool(schoolId: string): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${this.API_URL}/school/${schoolId}/upcoming`);
  }

  /**
   * Récupérer les événements créés par un utilisateur
   */
  getEventsByCreator(creatorId: string): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${this.API_URL}/creator/${creatorId}`);
  }

  /**
   * Créer un nouvel événement
   */
  createEvent(event: CreateEventRequest, userId: string): Observable<EventResponse> {
    const params = new HttpParams().set('userId', userId);
    return this.http.post<EventResponse>(this.API_URL, event, { params });
  }

  /**
   * Modifier un événement
   */
  updateEvent(eventId: string, updates: UpdateEventRequest, userId: string): Observable<EventResponse> {
    const params = new HttpParams().set('userId', userId);
    return this.http.put<EventResponse>(`${this.API_URL}/${eventId}`, updates, { params });
  }

  /**
   * Supprimer un événement
   */
  deleteEvent(eventId: string, userId: string): Observable<{ message: string }> {
    const params = new HttpParams().set('userId', userId);
    return this.http.delete<{ message: string }>(`${this.API_URL}/${eventId}`, { params });
  }
}
```

---

## Gestion des erreurs

### 📁 Fichier: `error-handler.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

interface ApiError {
  error: string;
  message: string;
  fields?: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  /**
   * Gérer les erreurs HTTP
   */
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      const apiError = error.error as ApiError;
      
      if (apiError.message) {
        errorMessage = apiError.message;
      } else if (apiError.fields) {
        // Erreurs de validation
        const fieldErrors = Object.values(apiError.fields).join(', ');
        errorMessage = `Erreurs de validation: ${fieldErrors}`;
      } else {
        errorMessage = `Code: ${error.status}, Message: ${error.message}`;
      }
    }

    console.error('Erreur API:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Extraire le message d'erreur
   */
  extractErrorMessage(error: any): string {
    if (error?.error?.message) {
      return error.error.message;
    }
    if (error?.message) {
      return error.message;
    }
    return 'Une erreur est survenue';
  }
}
```

---

## Exemples de composants

### 1. Composant d'inscription

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SchoolService } from '../services/school.service';
import { ErrorHandlerService } from '../services/error-handler.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;
  schools: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private schoolService: SchoolService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [''],
      schoolId: ['', [Validators.required]]
    });

    this.loadSchools();
  }

  loadSchools(): void {
    this.schoolService.getAllSchools().subscribe({
      next: (schools) => this.schools = schools,
      error: (err) => console.error('Erreur chargement écoles:', err)
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/events']);
        } else {
          this.errorMessage = response.message;
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = this.errorHandler.extractErrorMessage(err);
        this.loading = false;
      }
    });
  }
}
```

### Template HTML (`register.component.html`)

```html
<div class="register-container">
  <h2>Inscription</h2>
  
  <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
    <div class="form-group">
      <label for="firstName">Prénom *</label>
      <input 
        id="firstName" 
        type="text" 
        formControlName="firstName" 
        class="form-control"
      >
    </div>

    <div class="form-group">
      <label for="lastName">Nom *</label>
      <input 
        id="lastName" 
        type="text" 
        formControlName="lastName" 
        class="form-control"
      >
    </div>

    <div class="form-group">
      <label for="email">Email *</label>
      <input 
        id="email" 
        type="email" 
        formControlName="email" 
        class="form-control"
      >
    </div>

    <div class="form-group">
      <label for="password">Mot de passe * (min. 6 caractères)</label>
      <input 
        id="password" 
        type="password" 
        formControlName="password" 
        class="form-control"
      >
    </div>

    <div class="form-group">
      <label for="phone">Téléphone</label>
      <input 
        id="phone" 
        type="tel" 
        formControlName="phone" 
        class="form-control"
      >
    </div>

    <div class="form-group">
      <label for="schoolId">École Polytech *</label>
      <select 
        id="schoolId" 
        formControlName="schoolId" 
        class="form-control"
      >
        <option value="">Sélectionnez votre école</option>
        <option *ngFor="let school of schools" [value]="school.id">
          {{ school.name }}
        </option>
      </select>
    </div>

    <div class="error-message" *ngIf="errorMessage">
      {{ errorMessage }}
    </div>

    <button 
      type="submit" 
      [disabled]="registerForm.invalid || loading"
      class="btn btn-primary"
    >
      {{ loading ? 'Inscription...' : 'S\'inscrire' }}
    </button>
  </form>

  <p class="login-link">
    Déjà inscrit ? <a routerLink="/login">Se connecter</a>
  </p>
</div>
```

---

### 2. Composant de connexion

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ErrorHandlerService } from '../services/error-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/events']);
        } else {
          this.errorMessage = response.message;
        }
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = this.errorHandler.extractErrorMessage(err);
        this.loading = false;
      }
    });
  }
}
```

### Template HTML (`login.component.html`)

```html
<div class="login-container">
  <h2>Connexion</h2>
  
  <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
    <div class="form-group">
      <label for="email">Email</label>
      <input 
        id="email" 
        type="email" 
        formControlName="email" 
        class="form-control"
        placeholder="votre.email@example.com"
      >
    </div>

    <div class="form-group">
      <label for="password">Mot de passe</label>
      <input 
        id="password" 
        type="password" 
        formControlName="password" 
        class="form-control"
      >
    </div>

    <div class="error-message" *ngIf="errorMessage">
      {{ errorMessage }}
    </div>

    <button 
      type="submit" 
      [disabled]="loginForm.invalid || loading"
      class="btn btn-primary"
    >
      {{ loading ? 'Connexion...' : 'Se connecter' }}
    </button>
  </form>

  <p class="register-link">
    Pas encore inscrit ? <a routerLink="/register">S'inscrire</a>
  </p>
</div>
```

---

### 3. Composant liste des événements

```typescript
import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html'
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  loading = true;
  currentUser: any = null;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getUpcomingEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement événements:', err);
        this.loading = false;
      }
    });
  }

  canEditEvent(event: any): boolean {
    if (!this.currentUser) return false;
    return event.createdBy === this.currentUser.id || this.currentUser.role === 'admin';
  }

  editEvent(eventId: string): void {
    this.router.navigate(['/events', eventId, 'edit']);
  }

  deleteEvent(event: any): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${event.name}" ?`)) {
      return;
    }

    this.eventService.deleteEvent(event.id, this.currentUser.id).subscribe({
      next: () => {
        this.events = this.events.filter(e => e.id !== event.id);
        alert('Événement supprimé avec succès');
      },
      error: (err) => {
        alert('Erreur lors de la suppression: ' + err.message);
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
```

### Template HTML (`event-list.component.html`)

```html
<div class="event-list-container">
  <div class="header">
    <h2>Événements à venir</h2>
    <button 
      *ngIf="currentUser" 
      routerLink="/events/create" 
      class="btn btn-primary"
    >
      Créer un événement
    </button>
  </div>

  <div *ngIf="loading" class="loading">
    Chargement des événements...
  </div>

  <div *ngIf="!loading && events.length === 0" class="no-events">
    Aucun événement à venir
  </div>

  <div class="events-grid" *ngIf="!loading && events.length > 0">
    <div *ngFor="let event of events" class="event-card">
      <div class="event-header">
        <h3>{{ event.name }}</h3>
        <span class="school-badge">{{ event.schoolName }}</span>
      </div>

      <div class="event-details">
        <p><strong>Débute le:</strong> {{ formatDate(event.startsAt) }}</p>
        <p *ngIf="event.endsAt"><strong>Fin:</strong> {{ formatDate(event.endsAt) }}</p>
        <p *ngIf="event.address"><strong>Lieu:</strong> {{ event.address }}</p>
        <p *ngIf="event.room"><strong>Salle:</strong> {{ event.room }}</p>
        <p *ngIf="event.activities"><strong>Activités:</strong> {{ event.activities }}</p>
        <p class="creator"><strong>Créé par:</strong> {{ event.createdByName }}</p>
      </div>

      <div class="event-actions" *ngIf="canEditEvent(event)">
        <button (click)="editEvent(event.id)" class="btn btn-secondary">
          Modifier
        </button>
        <button (click)="deleteEvent(event)" class="btn btn-danger">
          Supprimer
        </button>
      </div>
    </div>
  </div>
</div>
```

---

### 4. Composant création d'événement

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { SchoolService } from '../services/school.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html'
})
export class CreateEventComponent implements OnInit {
  eventForm: FormGroup;
  schools: any[] = [];
  loading = false;
  errorMessage = '';
  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private schoolService: SchoolService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.eventForm = this.fb.group({
      schoolId: [this.currentUser.schoolId, [Validators.required]],
      name: ['', [Validators.required]],
      activities: [''],
      startsAt: ['', [Validators.required]],
      endsAt: [''],
      address: [''],
      room: ['']
    });
  }

  ngOnInit(): void {
    this.loadSchools();
  }

  loadSchools(): void {
    this.schoolService.getAllSchools().subscribe({
      next: (schools) => this.schools = schools,
      error: (err) => console.error('Erreur chargement écoles:', err)
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const eventData = {
      ...this.eventForm.value,
      startsAt: new Date(this.eventForm.value.startsAt).toISOString(),
      endsAt: this.eventForm.value.endsAt 
        ? new Date(this.eventForm.value.endsAt).toISOString() 
        : undefined
    };

    this.eventService.createEvent(eventData, this.currentUser.id).subscribe({
      next: (event) => {
        alert('Événement créé avec succès !');
        this.router.navigate(['/events']);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }
}
```

### Template HTML (`create-event.component.html`)

```html
<div class="create-event-container">
  <h2>Créer un événement</h2>
  
  <form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
    <div class="form-group">
      <label for="name">Nom de l'événement *</label>
      <input 
        id="name" 
        type="text" 
        formControlName="name" 
        class="form-control"
        placeholder="Ex: Soirée d'intégration Lyon 2025"
      >
    </div>

    <div class="form-group">
      <label for="schoolId">École *</label>
      <select 
        id="schoolId" 
        formControlName="schoolId" 
        class="form-control"
      >
        <option *ngFor="let school of schools" [value]="school.id">
          {{ school.name }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="startsAt">Date et heure de début *</label>
      <input 
        id="startsAt" 
        type="datetime-local" 
        formControlName="startsAt" 
        class="form-control"
      >
    </div>

    <div class="form-group">
      <label for="endsAt">Date et heure de fin</label>
      <input 
        id="endsAt" 
        type="datetime-local" 
        formControlName="endsAt" 
        class="form-control"
      >
    </div>

    <div class="form-group">
      <label for="address">Adresse</label>
      <input 
        id="address" 
        type="text" 
        formControlName="address" 
        class="form-control"
        placeholder="Ex: Campus Lyon, 15 rue de la Tech"
      >
    </div>

    <div class="form-group">
      <label for="room">Salle</label>
      <input 
        id="room" 
        type="text" 
        formControlName="room" 
        class="form-control"
        placeholder="Ex: Amphi A"
      >
    </div>

    <div class="form-group">
      <label for="activities">Activités</label>
      <textarea 
        id="activities" 
        formControlName="activities" 
        class="form-control"
        rows="4"
        placeholder="Ex: Jeux, repas, soirée..."
      ></textarea>
    </div>

    <div class="error-message" *ngIf="errorMessage">
      {{ errorMessage }}
    </div>

    <div class="form-actions">
      <button 
        type="button" 
        routerLink="/events" 
        class="btn btn-secondary"
      >
        Annuler
      </button>
      <button 
        type="submit" 
        [disabled]="eventForm.invalid || loading"
        class="btn btn-primary"
      >
        {{ loading ? 'Création...' : 'Créer l\'événement' }}
      </button>
    </div>
  </form>
</div>
```

---

## Guard pour protéger les routes

### 📁 Fichier: `auth.guard.ts`

```typescript
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Rediriger vers la page de connexion
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
}
```

### Configuration des routes (`app-routing.module.ts`)

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { CreateEventComponent } from './components/create-event/create-event.component';

const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'events', 
    component: EventListComponent 
  },
  { 
    path: 'events/create', 
    component: CreateEventComponent,
    canActivate: [AuthGuard] // Route protégée
  },
  { path: '**', redirectTo: '/events' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

---

## Configuration HttpClient dans le module

### 📁 Fichier: `app.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Services
import { AuthService } from './services/auth.service';
import { SchoolService } from './services/school.service';
import { EventService } from './services/event.service';
import { ErrorHandlerService } from './services/error-handler.service';

// Components
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { CreateEventComponent } from './components/create-event/create-event.component';

// Guards
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    EventListComponent,
    CreateEventComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,        // Important pour les requêtes HTTP
    ReactiveFormsModule      // Important pour les formulaires
  ],
  providers: [
    AuthService,
    SchoolService,
    EventService,
    ErrorHandlerService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

---

## Résumé des endpoints disponibles

### Authentication
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Schools
- `GET /api/schools` - Liste des écoles
- `GET /api/schools/{id}` - Détails d'une école
- `POST /api/schools` - Créer une école (admin)

### Events
- `GET /api/events` - Tous les événements
- `GET /api/events/upcoming` - Événements à venir
- `GET /api/events/{id}` - Détails d'un événement
- `GET /api/events/school/{schoolId}` - Événements d'une école
- `GET /api/events/school/{schoolId}/upcoming` - Événements à venir d'une école
- `GET /api/events/creator/{creatorId}` - Événements d'un créateur
- `POST /api/events?userId={uuid}` - Créer un événement
- `PUT /api/events/{id}?userId={uuid}` - Modifier un événement
- `DELETE /api/events/{id}?userId={uuid}` - Supprimer un événement

---

## ✅ Checklist pour le développeur frontend

- [ ] Installer HttpClientModule dans app.module.ts
- [ ] Créer les 3 services (auth, school, event)
- [ ] Créer le service error-handler
- [ ] Implémenter l'AuthGuard
- [ ] Créer les composants (login, register, event-list, create-event)
- [ ] Configurer les routes
- [ ] Tester l'inscription
- [ ] Tester la connexion
- [ ] Tester la création d'événement
- [ ] Tester la liste des événements
- [ ] Tester la modification/suppression (créateur/admin uniquement)

---

## 📞 Support

En cas de problème :
1. Vérifier que le backend tourne sur `http://localhost:8080`
2. Vérifier les erreurs dans la console navigateur (F12)
3. Vérifier les logs du backend
4. Consulter les documentations API : `API_AUTH.md` et `API_EVENTS.md`

**Backend développé avec Spring Boot 3.5.6 + PostgreSQL 18**
