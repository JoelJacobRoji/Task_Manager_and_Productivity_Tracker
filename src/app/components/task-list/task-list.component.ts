import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../ui/confirm-dialog.component';
import { PriorityHighlightDirective } from '../../directives/priority-highlight.directive';
import { TaskFilterPipe, TaskPipeFilter } from '../../pipes/task-filter.pipe';
import { Category } from '../../models/category.model';
import { TaskService } from '../../services/task.service';
import { Task, TaskPriority } from '../../models/task.model';

@Component({
  standalone: true,
  selector: 'app-task-list',
  imports: [
    AsyncPipe,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSelectModule,
    RouterModule,
    PriorityHighlightDirective,
    TaskFilterPipe
  ],
  styleUrls: ['./task-list.component.css'],
  template: `
    <section class="tasks-page">
      <mat-card class="summary-card">
        <div class="summary-line" *ngIf="summary$ | async as summary">
          <h2>Task Dashboard</h2>
          <p>Completed {{ summary.completed }} / {{ summary.total }} tasks</p>
        </div>

        <mat-progress-bar mode="determinate" [value]="(completionPercent$ | async) ?? 0"></mat-progress-bar>
      </mat-card>

      <div class="status-filters">
        <button mat-button class="filter-pill" [class.active]="filter.completion === 'all'" (click)="setCompletion('all')">
          All
        </button>
        <button
          mat-button
          class="filter-pill"
          [class.active]="filter.completion === 'pending'"
          (click)="setCompletion('pending')"
        >
          Pending
        </button>
        <button
          mat-button
          class="filter-pill"
          [class.active]="filter.completion === 'completed'"
          (click)="setCompletion('completed')"
        >
          Completed
        </button>
      </div>

      <mat-card class="filters-card">
        <div class="filter-grid">
          <mat-form-field appearance="outline">
            <mat-label>Priority</mat-label>
            <mat-select [value]="filter.priority" (valueChange)="filter.priority = $event">
              <mat-option value="all">All</mat-option>
              <mat-option *ngFor="let priority of priorities" [value]="priority">{{ priority }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select [value]="filter.category" (valueChange)="filter.category = $event">
              <mat-option value="all">All</mat-option>
              <mat-option *ngFor="let category of categories" [value]="category.name">
                {{ category.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card>

      <ng-container *ngIf="(tasks$ | async | taskFilter: filter) as filteredTasks">
        <div class="task-cards" *ngIf="filteredTasks.length; else emptyState">
          <mat-card
            class="task-card"
            *ngFor="let task of filteredTasks"
            [appPriorityHighlight]="task.priority"
            [dueDate]="task.dueDate"
            [completed]="task.completed"
          >
            <div class="task-content">
              <div class="task-main">
                <mat-checkbox
                  class="task-checkbox"
                  [checked]="task.completed"
                  (change)="toggle(task.id)"
                  aria-label="Mark complete"
                ></mat-checkbox>

                <div>
                  <div class="task-title" [class.completed]="task.completed">{{ task.title }}</div>
                  <p class="task-description">{{ task.description || 'No description provided.' }}</p>
                  <p class="task-meta" [class.overdue]="isOverdue(task)">
                    Due: {{ task.dueDate | date: 'mediumDate' }}
                  </p>
                  <p class="task-meta">{{ task.category }} · {{ task.priority }}</p>
                </div>
              </div>

              <div class="task-actions">
                <button mat-button [routerLink]="['/task', task.id]">View</button>
                <button mat-button [routerLink]="['/edit', task.id]">Edit</button>
                <button mat-button color="warn" (click)="delete(task)">Delete</button>
              </div>
            </div>
          </mat-card>
        </div>

        <ng-template #emptyState>
          <mat-card class="empty-state">
            <h3>No tasks found</h3>
            <p>Try changing filters or add a new task.</p>
            <button mat-raised-button color="primary" routerLink="/add-task">Add Task</button>
          </mat-card>
        </ng-template>
      </ng-container>
    </section>
  `
})
export class TaskListComponent {
  readonly tasks$: Observable<Task[]>;
  readonly completionPercent$: Observable<number>;
  readonly summary$: Observable<{ total: number; completed: number }>;

  readonly priorities: TaskPriority[];
  readonly categories: Category[];

  filter: TaskPipeFilter = {
    completion: 'all',
    priority: 'all',
    category: 'all'
  };

  constructor(
    private readonly taskService: TaskService,
    private readonly dialog: MatDialog
  ) {
    this.tasks$ = this.taskService.getTasks();
    this.completionPercent$ = this.taskService.completionPercent$;
    this.summary$ = this.tasks$.pipe(
      map(tasks => ({
        total: tasks.length,
        completed: tasks.filter(task => task.completed).length
      }))
    );

    this.priorities = this.taskService.priorities;
    this.categories = this.taskService.getCategories();
  }

  setCompletion(completion: 'all' | 'pending' | 'completed'): void {
    this.filter.completion = completion;
  }

  toggle(id: number): void {
    this.taskService.toggleComplete(id).subscribe();
  }

  delete(task: Task): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '360px',
        data: {
          title: 'Delete Task',
          message: `Delete "${task.title}"? This action cannot be undone.`,
          confirmLabel: 'Delete'
        }
      })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.taskService.deleteTask(task.id).subscribe();
        }
      });
  }

  isOverdue(task: Task): boolean {
    return !task.completed && new Date(task.dueDate).getTime() < Date.now();
  }
}
