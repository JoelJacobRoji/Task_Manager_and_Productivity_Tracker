import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-completed-tasks',
  imports: [CommonModule],
  template: `
    <h2>Completed Tasks</h2>
    <p>No tasks yet.</p>
  `
})
export class CompletedTasksComponent {}
