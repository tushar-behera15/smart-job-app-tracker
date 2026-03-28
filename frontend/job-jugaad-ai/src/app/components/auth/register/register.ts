import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-violet-50 dark:bg-gray-950 py-10 px-4 sm:px-6 lg:px-8 transition-all duration-300 relative">
      <!-- Theme Toggle (Top Right) -->
      <div class="absolute top-4 right-4 sm:top-8 sm:right-8">
        <button 
          (click)="themeService.toggleDarkMode()" 
          class="p-3 text-violet-600 dark:text-violet-400 bg-white dark:bg-gray-900 shadow-xl shadow-violet-200/20 dark:shadow-none border border-violet-100 dark:border-violet-900/30 rounded-2xl transition-all active:scale-90 cursor-pointer"
        >
          <svg *ngIf="themeService.isDarkMode()" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          <svg *ngIf="!themeService.isDarkMode()" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
        </button>
      </div>

      <div class="max-w-md w-full space-y-6 p-6 sm:p-10 bg-white dark:bg-gray-900 rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-violet-100 dark:border-violet-900/30 transition-all hover:shadow-violet-200/50 dark:hover:shadow-violet-900/40 mt-8">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-violet-100 dark:bg-violet-900/30 rounded-2xl mb-5 group transition-all duration-300 hover:rotate-12">
            <svg class="w-8 h-8 text-violet-600 dark:text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 class="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
            Get Started
          </h2>
          <p class="mt-2 text-xs sm:text-sm text-violet-600/70 dark:text-violet-400/70 font-bold uppercase tracking-widest">
            Join the elite job hunters
          </p>
        </div>
        
        <form class="mt-6 space-y-5" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Email address</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="block w-full px-4 py-3 sm:py-3.5 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all duration-200"
                placeholder="you@email.com"
              />
              <p *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.invalid" class="mt-1.5 ml-2 text-xs font-bold text-rose-500">
                Invalid email format
              </p>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div>
                <label for="password" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Password</label>
                <div class="relative">
                  <input
                    [type]="showPassword ? 'text' : 'password'"
                    formControlName="password"
                    class="block w-full px-4 py-3 sm:py-3.5 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all duration-200 pr-12"
                    placeholder="••••••••"
                  />
                  <button type="button" (click)="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-violet-500">
                    <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88 12 12a1 1 0 0 0 1.12 1.12"></path><path d="M4.22 4.22 19.78 19.78"></path><path d="M10.37 5.09a10.3 10.3 0 0 1 1.63-.09c7 0 10 7 10 7a13.12 13.12 0 0 1-1.58 2"></path><path d="M22 22 2 2"></path><path d="M14.12 18.88A10.2 10.2 0 0 1 12 19c-7 0-10-7-10-7a13.16 13.16 0 0 1 1.57-2"></path></svg>
                  </button>
                </div>
                <p *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.invalid" class="mt-1.5 ml-2 text-xs font-bold text-rose-500">
                  Password too short (min 6)
                </p>
              </div>

              <div>
                <label for="confirmPassword" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Confirm Password</label>
                <div class="relative">
                  <input
                    [type]="showConfirmPassword ? 'text' : 'password'"
                    formControlName="confirmPassword"
                    class="block w-full px-4 py-3 sm:py-3.5 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all duration-200 pr-12"
                    placeholder="••••••••"
                  />
                  <button type="button" (click)="showConfirmPassword = !showConfirmPassword" class="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-violet-500">
                    <svg *ngIf="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <svg *ngIf="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88 12 12a1 1 0 0 0 1.12 1.12"></path><path d="M4.22 4.22 19.78 19.78"></path><path d="M10.37 5.09a10.3 10.3 0 0 1 1.63-.09c7 0 10 7 10 7a13.12 13.12 0 0 1-1.58 2"></path><path d="M22 22 2 2"></path><path d="M14.12 18.88A10.2 10.2 0 0 1 12 19c-7 0-10-7-10-7a13.16 13.16 0 0 1 1.57-2"></path></svg>
                  </button>
                </div>
                <p *ngIf="registerForm.get('confirmPassword')?.touched && registerForm.hasError('passwordMismatch')" class="mt-1.5 ml-2 text-xs font-bold text-rose-500">
                  Passwords do not match
                </p>
              </div>
            </div>
          </div>

          <div *ngIf="errorMessage" class="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30">
            {{ errorMessage }}
          </div>
          
          <div *ngIf="successMessage" class="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 font-bold">
            {{ successMessage }}
          </div>

          <button
            type="submit"
            [disabled]="registerForm.invalid || isLoading"
            class="w-full flex justify-center py-4 px-4 bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white text-base font-black rounded-2xl shadow-xl transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 group"
          >
            {{ isLoading ? 'Entering...' : 'Create Account' }}
          </button>

          <div class="text-center pt-2">
            <p class="text-sm font-bold text-gray-500 dark:text-gray-400">
              Joined before? 
              <a routerLink="/login" class="text-violet-600 dark:text-violet-400 font-black hover:text-violet-700 transition-colors underline underline-offset-8 decoration-2 decoration-violet-200 dark:decoration-violet-900/50">Sign In</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  themeService = inject(ThemeService);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMessage = 'Welcome to the platform! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'We encountered an error during registration.';
        }
      });
    }
  }
}
