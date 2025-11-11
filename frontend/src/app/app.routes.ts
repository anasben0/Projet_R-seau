import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { Dashboard } from './components/dashboard/dashboard';
import { EventsComponent } from './components/events/events.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: Dashboard,
    canActivate: [authGuard]  // Route protégée
  },
  { 
    path: 'events', 
    component: EventsComponent,
    canActivate: [authGuard]  // Route protégée
  },
  { 
    path: 'events/:id', 
    component: EventDetailsComponent,
    canActivate: [authGuard]  // Route protégée
  },
  { path: '**', redirectTo: '/login' }
];
