import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Connexion utilisateur
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        if (response.success && response.user) {
          this.saveUser(response.user);
        }
      })
    );
  }

  /**
   * Inscription utilisateur
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => {
        if (response.success && response.user) {
          this.saveUser(response.user);
        }
      })
    );
  }

  /**
   * Déconnexion
   */
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('polytech_user');
    }
    this.currentUserSubject.next(null);
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Vérifier si l'utilisateur est admin
   */
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  /**
   * Obtenir l'utilisateur actuel
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Sauvegarder l'utilisateur dans localStorage
   */
  private saveUser(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('polytech_user', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  /**
   * Récupérer l'utilisateur depuis localStorage
   */
  private getUserFromStorage(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('polytech_user');
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }
}
