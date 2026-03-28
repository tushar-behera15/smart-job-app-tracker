import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-violet-50 dark:bg-gray-950 transition-colors duration-300 relative overflow-x-hidden">
      <!-- Sidebar Overlay -->
      <div 
        *ngIf="isSidebarOpen" 
        (click)="isSidebarOpen = false"
        class="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 transition-opacity sm:hidden"
      ></div>

      <!-- Mobile Sidebar (Sliding Window from Right) -->
      <div 
        class="fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out sm:hidden"
        [class.translate-x-0]="isSidebarOpen"
        [class.translate-x-full]="!isSidebarOpen"
      >
        <div class="p-6 flex flex-col h-full">
          <div class="flex justify-between items-center mb-10">
            <span class="text-xl font-black text-violet-600 dark:text-violet-400">Settings</span>
            <button (click)="isSidebarOpen = false" class="p-2 text-gray-500 hover:text-violet-600 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div class="flex-1">
            <div *ngIf="user" class="mb-8 p-4 bg-violet-50 dark:bg-violet-900/10 rounded-2xl border border-violet-100 dark:border-violet-900/30">
              <p class="text-xs font-bold text-violet-600/60 dark:text-violet-400/60 uppercase tracking-widest mb-1">Logged in as</p>
              <p class="text-sm font-black text-gray-900 dark:text-white truncate">{{ user.email }}</p>
            </div>
            
            <!-- Mobile Theme Toggle in Sidebar -->
            <button 
              (click)="themeService.toggleDarkMode()" 
              class="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold transition-all active:scale-95"
            >
              <span>{{ themeService.isDarkMode() ? 'Light Mode' : 'Dark Mode' }}</span>
              <svg *ngIf="themeService.isDarkMode()" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              <svg *ngIf="!themeService.isDarkMode()" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            </button>
          </div>

          <button
            (click)="logout()"
            class="w-full py-4 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-black rounded-2xl border border-rose-100 dark:border-rose-900/30 hover:bg-rose-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Logout
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl sticky top-0 z-40 border-b border-violet-100 dark:border-violet-900/30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 sm:h-20">
            <div class="flex items-center">
              <span class="text-xl sm:text-3xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent tracking-tight py-2">
                JobJugaad AI
              </span>
            </div>
            
            <div class="flex items-center space-x-2 sm:space-x-4">
              <!-- Desktop Navigation -->
              <div class="hidden sm:flex items-center space-x-6">
                <!-- Theme Toggle Button (Desktop) -->
                <button 
                  (click)="themeService.toggleDarkMode()" 
                  class="p-2.5 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-xl transition-all active:scale-90 cursor-pointer"
                >
                  <svg *ngIf="themeService.isDarkMode()" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                  <svg *ngIf="!themeService.isDarkMode()" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                </button>

                <span *ngIf="user" class="text-sm font-bold text-gray-600 dark:text-gray-400">
                  Hi, <span class="text-violet-600 dark:text-violet-400">{{ user.email }}</span>
                </span>
                
                <button
                  (click)="logout()"
                  class="inline-flex items-center px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-black rounded-xl hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  Logout
                </button>
              </div>

              <!-- Mobile Hamburger Toggle -->
              <button 
                (click)="isSidebarOpen = true"
                class="sm:hidden p-2 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main class="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div class="bg-white dark:bg-gray-900 rounded-[2rem] sm:rounded-[3rem] shadow-2xl shadow-violet-200/50 dark:shadow-none border border-violet-100 dark:border-violet-900/30 overflow-hidden transition-all duration-300">
          <div class="p-6 sm:p-12">
            <div class="text-center max-w-2xl mx-auto">
              <div class="inline-flex items-center justify-center p-4 bg-violet-100/50 dark:bg-violet-900/20 rounded-3xl mb-6 shadow-sm">
                <svg class="h-8 w-8 sm:h-12 sm:w-12 text-violet-600 dark:text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                </svg>
              </div>
              <h1 class="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
                Welcome Future
              </h1>
              <p class="text-sm sm:text-lg text-gray-500 dark:text-gray-400 font-bold max-w-lg mx-auto leading-relaxed">
                Your career command center is ready. Let's find your next big opportunity.
              </p>
            </div>

            <div class="mt-12 sm:mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div class="group p-8 bg-violet-50/50 dark:bg-gray-800/30 rounded-[2rem] border-2 border-transparent hover:border-violet-200 dark:hover:border-violet-900/40 transition-all duration-300">
                <div class="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                </div>
                <h3 class="text-xl font-black text-gray-900 dark:text-white mb-2">Track Jobs</h3>
                <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-bold leading-relaxed">Keep an organized record of every application status.</p>
              </div>

              <div class="group p-8 bg-violet-50/50 dark:bg-gray-800/30 rounded-[2rem] border-2 border-transparent hover:border-violet-200 dark:hover:border-violet-900/40 transition-all duration-300">
                <div class="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3 class="text-xl font-black text-gray-900 dark:text-white mb-2">Resume Score</h3>
                <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-bold leading-relaxed">Instant analysis on how well your resume matches jobs.</p>
              </div>

              <div class="group p-8 bg-violet-50/50 dark:bg-gray-800/30 rounded-[2rem] border-2 border-transparent hover:border-violet-200 dark:hover:border-violet-900/40 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                <div class="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                </div>
                <h3 class="text-xl font-black text-gray-900 dark:text-white mb-2">AI Insights</h3>
                <p class="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-bold leading-relaxed">Smart suggestions to improve your profile and visibility.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  user: any = null;
  isSidebarOpen = false;
  themeService = inject(ThemeService);

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.getMe().subscribe({
      next: (user) => {
        this.user = user;
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
