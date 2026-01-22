import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="logo">
        📝 Task Tracker
      </div>

      <div class="links">
        <a routerLink="/tasks">Tasks</a>
        <a routerLink="/add">+ Add Task</a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      height: 64px;
      padding: 0 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(90deg, #0f172a, #1e293b);
      color: white;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }

    .logo {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    .links a {
      margin-left: 24px;
      text-decoration: none;
      font-weight: 600;
      color: #e5e7eb;
      transition: color 0.2s ease;
    }

    .links a:hover {
      color: #38bdf8;
    }
  `]
})
export class NavbarComponent {}
