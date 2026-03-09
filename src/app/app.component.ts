import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="page-wrapper">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .page-wrapper {
      max-width: 1160px;
      margin: 1.1rem auto 1.8rem;
      padding: 0 1rem 1.5rem;
    }

    @media (max-width: 640px) {
      .page-wrapper {
        padding: 0 0.7rem 1.1rem;
      }
    }
  `]
})
export class AppComponent {}
