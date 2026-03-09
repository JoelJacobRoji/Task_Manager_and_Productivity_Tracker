import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmDialogComponent } from '../ui/confirm-dialog.component';
import { Category } from '../../models/category.model';
import { Task, TaskPriority } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

interface EditableTask {
  title: string;
  description: string;
  dueDate: string;
  category: string;
  priority: TaskPriority;
  completed: boolean;
}

@Component({
  standalone: true,
  selector: 'app-task-edit',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <section class="form-page">
      <mat-card class="form-card" *ngIf="task; else missingTask">
        <h2>Edit Task</h2>

        <form #editForm="ngForm" (ngSubmit)="save(editForm.valid)" novalidate>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Title</mat-label>
            <input
              matInput
              name="title"
              [(ngModel)]="task.title"
              required
              minlength="3"
              maxlength="60"
              #titleCtrl="ngModel"
            />
            <mat-error *ngIf="titleCtrl.invalid && titleCtrl.touched">
              Title is required (3-60 characters).
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea
              matInput
              rows="4"
              name="description"
              [(ngModel)]="task.description"
              required
              maxlength="200"
              #descriptionCtrl="ngModel"
            ></textarea>
            <mat-hint align="end">{{ task.description.length }}/200</mat-hint>
            <mat-error *ngIf="descriptionCtrl.invalid && descriptionCtrl.touched">
              Description is required and cannot exceed 200 characters.
            </mat-error>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Category</mat-label>
              <mat-select name="category" [(ngModel)]="task.category" required #categoryCtrl="ngModel">
                <mat-option *ngFor="let category of categories" [value]="category.name">
                  {{ category.name }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="categoryCtrl.invalid && categoryCtrl.touched">Category is required.</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Priority</mat-label>
              <mat-select name="priority" [(ngModel)]="task.priority" required>
                <mat-option *ngFor="let priority of priorities" [value]="priority">{{ priority }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Due Date</mat-label>
            <input
              matInput
              type="date"
              name="dueDate"
              [(ngModel)]="task.dueDate"
              required
              [min]="minDate"
              #dueDateCtrl="ngModel"
            />
            <mat-error *ngIf="dueDateCtrl.invalid && dueDateCtrl.touched">Due date is required.</mat-error>
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" routerLink="/tasks">
              <mat-icon>arrow_back</mat-icon>
              Cancel
            </button>
            <button mat-flat-button color="primary" type="submit" [disabled]="editForm.invalid">
              <mat-icon>save</mat-icon>
              Save Changes
            </button>
          </div>
        </form>
      </mat-card>

      <ng-template #missingTask>
        <mat-card class="form-card">
          <h3>Task not found</h3>
          <button mat-raised-button color="primary" routerLink="/tasks">Back to tasks</button>
        </mat-card>
      </ng-template>
    </section>
  `,
  styles: [
    `
      .form-page {
        display: grid;
      }

      .form-card {
        max-width: 760px;
        margin: 0 auto;
        border-radius: 16px;
      }

      .full-width {
        width: 100%;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }

      .form-actions {
        margin-top: 1rem;
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
      }

      @media (max-width: 720px) {
        .form-row {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class TaskEditComponent {
  readonly categories: Category[];
  readonly priorities: TaskPriority[];
  readonly minDate: string;
  readonly taskId: number;
  readonly existingTask: Task | undefined;

  task: EditableTask | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly taskService: TaskService,
    private readonly dialog: MatDialog
  ) {
    this.categories = this.taskService.getCategories();
    this.priorities = this.taskService.priorities;
    this.minDate = new Date().toISOString().split('T')[0];

    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.existingTask = this.taskService.getTaskById(this.taskId);

    this.task = this.existingTask
      ? {
          title: this.existingTask.title,
          description: this.existingTask.description,
          dueDate: this.existingTask.dueDate,
          category: this.existingTask.category,
          priority: this.existingTask.priority,
          completed: this.existingTask.completed
        }
      : null;
  }

  save(isValid: boolean | null): void {
    if (!isValid || !this.task) {
      return;
    }

    const updatedTask: Task = {
      id: this.taskId,
      title: this.task.title.trim(),
      description: this.task.description.trim(),
      dueDate: this.task.dueDate,
      category: this.task.category,
      priority: this.task.priority,
      completed: this.task.completed
    };

    this.dialog
      .open(ConfirmDialogComponent, {
        width: '360px',
        data: {
          title: 'Save Changes',
          message: `Apply edits to "${updatedTask.title}"?`,
          confirmLabel: 'Save'
        }
      })
      .afterClosed()
      .subscribe(confirmed => {
        if (confirmed) {
          this.taskService.updateTask(updatedTask).subscribe(() => this.router.navigate(['/task', this.taskId]));
        }
      });
  }
}
