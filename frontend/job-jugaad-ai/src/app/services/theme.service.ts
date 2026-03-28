import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'user-theme';
  isDarkMode = signal<boolean>(false);

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    this.setDarkMode(shouldBeDark);
  }

  toggleDarkMode() {
    this.setDarkMode(!this.isDarkMode());
  }

  private setDarkMode(isDark: boolean) {
    this.isDarkMode.set(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem(this.THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem(this.THEME_KEY, 'light');
    }
  }
}
