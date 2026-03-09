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
      max-width: 1100px;
      margin: 1rem auto;
      padding: 0 1rem 1.5rem;
    }
  `]
})
export class AppComponent {}
