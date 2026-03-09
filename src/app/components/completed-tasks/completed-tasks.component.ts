import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { TaskFilterPipe } from '../../pipes/task-filter.pipe';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  standalone: true,
  selector: 'app-completed-tasks',
  imports: [
    AsyncPipe,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    TaskFilterPipe
  ],
  template: `
    <section class="completed-page">
      <h2>Completed Tasks</h2>

      <ng-container *ngIf="(tasks$ | async | taskFilter: { completion: 'completed' }) as completedTasks">
        <mat-card class="completed-card" *ngFor="let task of completedTasks">
          <div class="card-row">
            <div>
              <h3>{{ task.title }}</h3>
              <p>{{ task.description | slice: 0 : 100 }}{{ task.description.length > 100 ? '...' : '' }}</p>
              <p>Category: {{ task.category }} | Priority: {{ task.priority }}</p>
              <p>Completed before due date: {{ task.dueDate | date: 'mediumDate' }}</p>
            </div>
            <div class="actions">
              <button mat-icon-button [routerLink]="['/task', task.id]" aria-label="View details">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button [routerLink]="['/edit', task.id]" aria-label="Edit task">
                <mat-icon>edit</mat-icon>
              </button>
            </div>
          </div>
        </mat-card>

        <mat-card *ngIf="completedTasks.length === 0" class="empty-state">
          <p>No completed tasks yet.</p>
          <button mat-raised-button color="primary" routerLink="/tasks">Back to tasks</button>
        </mat-card>
      </ng-container>
    </section>
  `,
  styles: [
    `
      .completed-page {
        display: grid;
        gap: 0.75rem;
      }

      .completed-card {
        border-radius: 14px;
      }

      .card-row {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
      }

      .card-row h3 {
        margin: 0;
      }

      .card-row p {
        margin: 0.35rem 0;
      }

      .actions {
        display: flex;
        align-items: flex-start;
        gap: 0.25rem;
      }

      .empty-state {
        text-align: center;
        padding: 1.5rem;
      }
    `
  ]
})
export class CompletedTasksComponent {
  readonly tasks$: Observable<Task[]>;

  constructor(private readonly taskService: TaskService) {
    this.tasks$ = this.taskService.getTasks();
  }
}
