import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AppTheme, ThemeService } from '../../services/theme.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [
    AsyncPipe,
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ],
  template: `
    <mat-toolbar class="navbar">
      <a class="brand" routerLink="/tasks">Task Tracker</a>

      <div class="links">
        <a mat-button routerLink="/tasks" routerLinkActive="active-link">All Tasks</a>
        <a mat-button routerLink="/add-task" routerLinkActive="active-link">Add Task</a>
        <a mat-button routerLink="/completed" routerLinkActive="active-link">Completed</a>
      </div>

      <div class="actions">
        <button mat-icon-button (click)="toggleTheme()" [attr.aria-label]="(theme$ | async) === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
          <mat-icon>{{ (theme$ | async) === 'dark' ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>

        <button mat-stroked-button (click)="toggleAuth()">
          <mat-icon>{{ (isLoggedIn$ | async) ? 'lock_open' : 'lock' }}</mat-icon>
          {{ (isLoggedIn$ | async) ? 'Logout' : 'Login' }}
        </button>
      </div>
    </mat-toolbar>
  `,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  readonly isLoggedIn$: Observable<boolean>;
  readonly theme$: Observable<AppTheme>;

  constructor(
    private readonly authService: AuthService,
    private readonly themeService: ThemeService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.theme$ = this.themeService.theme$;
  }

  toggleAuth(): void {
    this.authService.toggle();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
