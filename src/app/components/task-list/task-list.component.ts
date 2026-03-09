import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
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
    MatIconModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule,
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

      <mat-card class="filters-card">
        <div class="filter-grid">
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select
              [value]="filter.completion"
              (valueChange)="filter.completion = $event"
            >
              <mat-option value="all">All</mat-option>
              <mat-option value="pending">Pending</mat-option>
              <mat-option value="completed">Completed</mat-option>
            </mat-select>
          </mat-form-field>

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
        <mat-card class="table-card">
          <div class="table-wrapper">
            <table mat-table [dataSource]="filteredTasks" class="tasks-table">
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Done</th>
                <td mat-cell *matCellDef="let task">
                  <mat-checkbox
                    [checked]="task.completed"
                    (change)="toggle(task.id, $event)"
                    aria-label="Mark complete"
                  ></mat-checkbox>
                </td>
              </ng-container>

              <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef>Task</th>
                <td
                  mat-cell
                  *matCellDef="let task"
                  [ngClass]="{ completed: task.completed }"
                  [ngStyle]="{ opacity: task.completed ? 0.6 : 1 }"
                >
                  <div class="task-title">{{ task.title }}</div>
                  <div class="task-description">
                    {{ task.description | slice: 0 : 80 }}{{ task.description.length > 80 ? '...' : '' }}
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef>Category</th>
                <td mat-cell *matCellDef="let task">{{ task.category }}</td>
              </ng-container>

              <ng-container matColumnDef="priority">
                <th mat-header-cell *matHeaderCellDef>Priority</th>
                <td mat-cell *matCellDef="let task">{{ task.priority }}</td>
              </ng-container>

              <ng-container matColumnDef="dueDate">
                <th mat-header-cell *matHeaderCellDef>Due Date</th>
                <td mat-cell *matCellDef="let task" [ngClass]="{ overdue: isOverdue(task) }">
                  {{ task.dueDate | date: 'mediumDate' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let task">
                  <button mat-icon-button [routerLink]="['/task', task.id]" aria-label="View details">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button [routerLink]="['/edit', task.id]" aria-label="Edit task">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="delete(task)" aria-label="Delete task">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr
                mat-row
                *matRowDef="let task; columns: displayedColumns;"
                [appPriorityHighlight]="task.priority"
                [dueDate]="task.dueDate"
                [completed]="task.completed"
                [ngClass]="{ completed: task.completed }"
              ></tr>
            </table>
          </div>
        </mat-card>

        <mat-card class="empty-state" *ngIf="filteredTasks.length === 0">
          <h3>No tasks found</h3>
          <p>Try changing the filters or add a new task.</p>
          <button mat-raised-button color="primary" routerLink="/add-task">Add Task</button>
        </mat-card>
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
  readonly displayedColumns = ['status', 'title', 'category', 'priority', 'dueDate', 'actions'];

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

  toggle(id: number, event: MatCheckboxChange): void {
    if (event) {
      this.taskService.toggleComplete(id).subscribe();
    }
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
