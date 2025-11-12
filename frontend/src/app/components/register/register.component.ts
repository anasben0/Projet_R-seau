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
  isAdminAccount = false; // Flag pour savoir si on crée un compte admin

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
      confirmPassword: ['', [Validators.required]],
      // Champs pour créer un compte admin
      isAdmin: [false],
      adminEmail: [''],
      adminPassword: ['']
    }, { validators: this.passwordMatchValidator });

    // Charger les écoles
    this.loadSchools();
  }

  loadSchools(): void {
    console.log('Loading schools from backend...');
    this.schoolService.getAllSchools().subscribe({
      next: (schools) => {
        console.log('Schools loaded:', schools.length);
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

  onAdminCheckboxChange(checked: boolean): void {
    this.isAdminAccount = checked;
    
    if (checked) {
      // Rendre les champs admin obligatoires
      this.registerForm.get('adminEmail')?.setValidators([Validators.required, Validators.email]);
      this.registerForm.get('adminPassword')?.setValidators([Validators.required]);
    } else {
      // Retirer les validateurs et réinitialiser les champs
      this.registerForm.get('adminEmail')?.clearValidators();
      this.registerForm.get('adminPassword')?.clearValidators();
      this.registerForm.patchValue({
        adminEmail: '',
        adminPassword: ''
      });
    }
    
    this.registerForm.get('adminEmail')?.updateValueAndValidity();
    this.registerForm.get('adminPassword')?.updateValueAndValidity();
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

    const { confirmPassword, adminEmail, adminPassword, ...registerData } = this.registerForm.value;
    
    console.log('Submitting registration:', { ...registerData, password: '***' });

    // Si compte admin, valider d'abord les credentials admin
    if (this.isAdminAccount) {
      console.log('Validating admin credentials...');
      this.authService.login({ email: adminEmail, password: adminPassword }).subscribe({
        next: (loginResponse) => {
          console.log('Admin validation response:', loginResponse);
          
          // Vérifier que l'utilisateur qui valide est bien admin
          if (loginResponse.user?.role !== 'admin') {
            this.errorMessage = 'Seul un administrateur peut créer un compte admin.';
            this.loading = false;
            return;
          }
          
          // Credentials admin valides, procéder à l'inscription avec rôle admin
          const adminRegisterData = {
            ...registerData,
            role: 'admin'
          };
          
          this.performRegistration(adminRegisterData);
        },
        error: (error) => {
          console.error('Erreur validation admin:', error);
          this.errorMessage = 'Identifiants administrateur invalides.';
          this.loading = false;
        }
      });
    } else {
      // Inscription normale (utilisateur standard)
      this.performRegistration(registerData);
    }
  }

  private performRegistration(registerData: any): void {
    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('Registration response:', response);
        if (response.success && response.user) {
          this.successMessage = 'Inscription réussie ! Redirection...';
          console.log('User registered successfully:', response.user);
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
        this.errorMessage = error.error?.message || error.message || 'Erreur lors de l\'inscription.';
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
  get isAdmin() { return this.registerForm.get('isAdmin'); }
  get adminEmail() { return this.registerForm.get('adminEmail'); }
  get adminPassword() { return this.registerForm.get('adminPassword'); }
}
