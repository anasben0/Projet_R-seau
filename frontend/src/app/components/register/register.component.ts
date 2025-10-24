import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SchoolService } from '../../services/school.service';
import { School } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  schools: School[] = [];
  loading = false;
  loadingSchools = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private schoolService: SchoolService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si déjà connecté, rediriger vers le dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      schoolId: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Charger les écoles
    this.loadSchools();
  }

  loadSchools(): void {
    this.schoolService.getAllSchools().subscribe({
      next: (schools) => {
        this.schools = schools;
        this.loadingSchools = false;
      },
      error: (error) => {
        console.error('Erreur chargement écoles:', error);
        this.errorMessage = 'Erreur lors du chargement des écoles.';
        this.loadingSchools = false;
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { confirmPassword, ...registerData } = this.registerForm.value;

    this.authService.register(registerData).subscribe({
      next: (response) => {
        if (response.success && response.user) {
          this.successMessage = 'Inscription réussie ! Redirection...';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 800);
        } else {
          this.errorMessage = response.message || 'Erreur lors de l\'inscription.';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Erreur inscription:', error);
        this.errorMessage = error.error?.message || 'Erreur lors de l\'inscription.';
        this.loading = false;
      }
    });
  }

  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get email() { return this.registerForm.get('email'); }
  get phone() { return this.registerForm.get('phone'); }
  get schoolId() { return this.registerForm.get('schoolId'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}
