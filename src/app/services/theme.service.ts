import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AppTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'task-tracker-theme';
  private readonly themeSubject = new BehaviorSubject<AppTheme>(this.getInitialTheme());

  readonly theme$ = this.themeSubject.asObservable();

  get currentTheme(): AppTheme {
    return this.themeSubject.value;
  }

  constructor() {
    this.applyTheme(this.currentTheme);
  }

  toggleTheme(): void {
    const nextTheme: AppTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  setTheme(theme: AppTheme): void {
    this.themeSubject.next(theme);
    localStorage.setItem(this.storageKey, theme);
    this.applyTheme(theme);
  }

  private getInitialTheme(): AppTheme {
    const saved = localStorage.getItem(this.storageKey);
    return saved === 'light' ? 'light' : 'dark';
  }

  private applyTheme(theme: AppTheme): void {
    document.body.classList.toggle('light-theme', theme === 'light');
    document.body.classList.toggle('dark-theme', theme === 'dark');
  }
}
