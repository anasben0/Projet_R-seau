import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard - Checking authentication for:', state.url);
  
  const isAuth = authService.isAuthenticated();
  
  console.log('AuthGuard - isAuthenticated result:', isAuth);
  console.log('AuthGuard - Current user:', authService.getCurrentUser());

  if (isAuth) {
    console.log('AuthGuard - Access granted to:', state.url);
    return true;
  } else {
    // Rediriger vers login si pas authentifié
    console.log('AuthGuard - Access denied, redirecting to /login');
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
