import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { Category } from '../../models/category.model';
import { TaskPriority } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  standalone: true,
  selector: 'app-task-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <section class="form-page">
      <mat-card class="form-card">
        <h2 class="form-title">Add New Task</h2>

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" placeholder="Task title" />
            <mat-hint align="end">{{ form.controls.title.value.length }}/60</mat-hint>
            <mat-error *ngIf="form.controls.title.hasError('required')">Title is required.</mat-error>
            <mat-error *ngIf="form.controls.title.hasError('maxlength')">Title cannot exceed 60 characters.</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput rows="4" formControlName="description"></textarea>
            <mat-hint align="end">{{ form.controls.description.value.length }}/200</mat-hint>
            <mat-error *ngIf="form.controls.description.hasError('required')">Description is required.</mat-error>
            <mat-error *ngIf="form.controls.description.hasError('maxlength')">
              Description cannot exceed 200 characters.
            </mat-error>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Category</mat-label>
              <mat-select formControlName="category">
                <mat-option *ngFor="let category of categories" [value]="category.name">
                  {{ category.name }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="form.controls.category.hasError('required')">Category is required.</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Priority</mat-label>
              <mat-select formControlName="priority">
                <mat-option *ngFor="let priority of priorities" [value]="priority">{{ priority }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Due Date</mat-label>
            <input matInput type="date" formControlName="dueDate" [min]="minDate" />
            <mat-error *ngIf="form.controls.dueDate.hasError('required')">Due date is required.</mat-error>
            <mat-error *ngIf="form.controls.dueDate.hasError('pastDate')">Due date cannot be in the past.</mat-error>
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" routerLink="/tasks">
              <mat-icon>arrow_back</mat-icon>
              Back
            </button>

            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
              <mat-icon>add_task</mat-icon>
              Add Task
            </button>
          </div>
        </form>
      </mat-card>
    </section>
  `
})
export class TaskFormComponent {
  readonly categories: Category[];
  readonly priorities: TaskPriority[];
  readonly minDate: string;
  readonly form: ReturnType<TaskFormComponent['createForm']>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly taskService: TaskService,
    private readonly router: Router
  ) {
    this.categories = this.taskService.getCategories();
    this.priorities = this.taskService.priorities;
    this.minDate = new Date().toISOString().split('T')[0];
    this.form = this.createForm();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.getRawValue();

    this.taskService
      .addTask({
        id: Date.now(),
        title: data.title.trim(),
        description: data.description.trim(),
        dueDate: data.dueDate,
        category: data.category,
        priority: data.priority,
        completed: false
      })
      .subscribe(() => this.router.navigate(['/tasks']));
  }

  private static noPastDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return selectedDate < today ? { pastDate: true } : null;
  }

  private createForm() {
    return this.fb.nonNullable.group({
      title: ['', [Validators.required, Validators.maxLength(60)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      dueDate: ['', [Validators.required, TaskFormComponent.noPastDateValidator]],
      category: ['General', [Validators.required]],
      priority: ['Medium' as TaskPriority, [Validators.required]]
    });
  }
}
