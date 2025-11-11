import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si déjà connecté, rediriger vers le dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        console.log('🔵 Réponse reçue du backend:', response);
        console.log('🔵 response.success =', response.success);
        console.log('🔵 response.user =', response.user);
        
        if (response.success && response.user) {
          console.log('✅ Connexion réussie, redirection vers dashboard');
          this.successMessage = 'Connexion réussie ! Redirection...';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 800);
        } else {
          console.log('❌ Connexion échouée:', response.message);
          this.errorMessage = response.message || 'Email ou mot de passe incorrect.';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('❌ Erreur HTTP de connexion:', error);
        console.error('❌ Status:', error.status);
        console.error('❌ Message:', error.message);
        this.errorMessage = 'Email ou mot de passe incorrect.';
        this.loading = false;
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
