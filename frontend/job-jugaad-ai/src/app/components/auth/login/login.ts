import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-violet-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300 relative">
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

      <div class="max-w-md w-full space-y-8 p-6 sm:p-10 bg-white dark:bg-gray-900 rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-violet-100 dark:border-violet-900/30 transition-all hover:shadow-violet-200/50 dark:hover:shadow-violet-900/40 mt-8">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-violet-100 dark:bg-violet-900/30 rounded-3xl mb-6 group transition-all duration-300 hover:rotate-12 shadow-sm">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-violet-600 dark:text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 class="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
            Welcome Back
          </h2>
          <p class="mt-2 text-sm sm:text-base text-violet-600/70 dark:text-violet-400/70 font-bold uppercase tracking-widest">
            The career future is here
          </p>
        </div>
        
        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4 sm:space-y-5">
            <div>
              <label for="email" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Email address</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="block w-full px-5 py-3.5 sm:py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all duration-200"
                placeholder="name@company.com"
              />
              <p *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid" class="mt-2 ml-2 text-xs font-bold text-rose-500 animate-pulse">
                Please enter a valid email address.
              </p>
            </div>

            <div>
              <label for="password" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Password</label>
              <div class="relative group">
                <input
                  [id]="'password'"
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  class="block w-full px-5 py-3.5 sm:py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all duration-200 pr-14"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  (click)="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88 12 12a1 1 0 0 0 1.12 1.12"></path><path d="M4.22 4.22 19.78 19.78"></path><path d="M10.37 5.09a10.3 10.3 0 0 1 1.63-.09c7 0 10 7 10 7a13.12 13.12 0 0 1-1.58 2"></path><path d="M22 22 2 2"></path><path d="M14.12 18.88A10.2 10.2 0 0 1 12 19c-7 0-10-7-10-7a13.16 13.16 0 0 1 1.57-2"></path></svg>
                </button>
              </div>
              <p *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid" class="mt-2 ml-2 text-xs font-bold text-rose-500 animate-pulse">
                Password must be at least 6 characters.
              </p>
            </div>
          </div>

          <div *ngIf="errorMessage" class="text-xs sm:text-sm font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30 animate-shake shadow-sm">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading"
            class="w-full flex justify-center py-4 px-4 bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white text-base font-black rounded-2xl shadow-xl shadow-violet-200 dark:shadow-none transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:grayscale group"
          >
            <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Checking...' : 'Sign In Now' }}
          </button>

          <div class="text-center pt-2">
            <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-bold">
              No account? 
              <a routerLink="/register" class="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors underline-offset-8 underline decoration-2 decoration-violet-200 dark:decoration-violet-900/50">Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .animate-shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  themeService = inject(ThemeService);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'The email or password you entered is incorrect.';
        }
      });
    }
  }
}
