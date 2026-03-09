import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../ui/confirm-dialog.component';
import { PriorityHighlightDirective } from '../../directives/priority-highlight.directive';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  standalone: true,
  selector: 'app-task-detail',
  imports: [
    AsyncPipe,
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    PriorityHighlightDirective
  ],
  template: `
    <section class="detail-page">
      <ng-container *ngIf="task$ | async as task; else notFound">
        <mat-card
          class="detail-card"
          [appPriorityHighlight]="task.priority"
          [dueDate]="task.dueDate"
          [completed]="task.completed"
        >
          <div class="header-row">
            <div>
              <h2>{{ task.title }}</h2>
              <p class="meta">Category: {{ task.category }} | Priority: {{ task.priority }}</p>
            </div>
            <div class="status" [ngClass]="{ completed: task.completed }">
              {{ task.completed ? 'Completed' : 'In Progress' }}
            </div>
          </div>

          <p class="description">{{ task.description || 'No description added.' }}</p>

          <p class="meta">Due Date: {{ task.dueDate | date: 'fullDate' }}</p>

          <div class="actions">
            <button mat-button routerLink="/tasks">
              <mat-icon>arrow_back</mat-icon>
              Back
            </button>

            <button mat-raised-button color="primary" [routerLink]="['/edit', task.id]">
              <mat-icon>edit</mat-icon>
              Edit
            </button>

            <button mat-raised-button (click)="toggle(task)">
              <mat-icon>{{ task.completed ? 'undo' : 'check_circle' }}</mat-icon>
              {{ task.completed ? 'Mark Pending' : 'Mark Complete' }}
            </button>

            <button mat-raised-button color="warn" (click)="delete(task)">
              <mat-icon>delete</mat-icon>
              Delete
            </button>
          </div>
        </mat-card>
      </ng-container>

      <ng-template #notFound>
        <mat-card class="detail-card empty-state">
          <h3>Task not found</h3>
          <button mat-raised-button color="primary" routerLink="/tasks">Back to task list</button>
        </mat-card>
      </ng-template>
    </section>
  `,
  styles: [
    `
      .detail-page {
        display: grid;
      }

      .detail-card {
        border-radius: 16px;
      }

      .header-row {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
      }

      .header-row h2 {
        margin: 0;
      }

      .meta {
        color: #64748b;
      }

      .status {
        padding: 0.25rem 0.75rem;
        border-radius: 999px;
        font-weight: 600;
        background: #fef3c7;
        color: #92400e;
        align-self: flex-start;
      }

      .status.completed {
        background: #dcfce7;
        color: #166534;
      }

      .description {
        margin: 1rem 0;
        line-height: 1.5;
      }

      .actions {
        margin-top: 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .empty-state {
        text-align: center;
      }
    `
  ]
})
export class TaskDetailComponent {
  readonly task$: Observable<Task | undefined>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly taskService: TaskService,
    private readonly dialog: MatDialog
  ) {
    this.task$ = this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      switchMap(id => this.taskService.getTaskById$(id))
    );
  }

  toggle(task: Task): void {
    this.taskService.toggleComplete(task.id).subscribe();
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
          this.taskService.deleteTask(task.id).subscribe(() => this.router.navigate(['/tasks']));
        }
      });
  }
}
