import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

import { Router, RouterModule } from '@angular/router';

import { TaskService } from '../../services/task.service';

@Component({
  standalone: true,
  selector: 'app-task-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    RouterModule
  ],

  template: `

<div class="form-page">

  <mat-card class="form-card">

    <h2 class="form-title">✨ Add New Task</h2>

    <form [formGroup]="form" (ngSubmit)="submit()">

      <!-- TITLE -->

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Title</mat-label>

        <input
          matInput
          formControlName="title"
          placeholder="Eg: Study networking"
        />

        <mat-error *ngIf="form.controls.title.hasError('required')">
          Title is required
        </mat-error>

      </mat-form-field>


      <!-- DESCRIPTION -->

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Description</mat-label>

        <textarea
          matInput
          rows="3"
          formControlName="description"
          placeholder="Optional details..."
        ></textarea>

        <mat-error *ngIf="form.controls.description.hasError('maxlength')">
          Description cannot exceed 200 characters
        </mat-error>

      </mat-form-field>


      <!-- CATEGORY + PRIORITY -->

      <div class="form-row">

        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Category</mat-label>
          <input matInput formControlName="category" />
        </mat-form-field>


        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Priority</mat-label>

          <mat-select formControlName="priority">
            <mat-option value="Low">Low</mat-option>
            <mat-option value="Medium">Medium</mat-option>
            <mat-option value="High">High</mat-option>
          </mat-select>

        </mat-form-field>

      </div>


      <!-- DUE DATE -->

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Due Date</mat-label>

        <input
          matInput
          type="date"
          formControlName="dueDate"
        />

        <mat-error *ngIf="form.controls.dueDate.hasError('required')">
          Due date is required
        </mat-error>

      </mat-form-field>


      <!-- BUTTONS -->

      <div class="form-actions">

        <button mat-button routerLink="/tasks">
          ← Back
        </button>

        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="form.invalid"
        >
          ➕ Add Task
        </button>

      </div>

    </form>

  </mat-card>

</div>

`
})

export class TaskFormComponent {

  form;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) {

    this.form = this.fb.nonNullable.group({

      title: ['', Validators.required],

      description: ['', Validators.maxLength(200)],

      dueDate: ['', Validators.required],

      category: ['General'],

      priority: ['Medium']

    });

  }


  submit() {

    if (this.form.invalid) return;

    const { title, description, dueDate, category } =
  this.form.getRawValue();

const priority = this.form.getRawValue().priority as 'Low' | 'Medium' | 'High';

    this.taskService.addTask({
      id: Date.now(),
      title,
      description,
      dueDate,
      category,
      priority,
      completed: false
    });

    this.form.reset();

    this.router.navigate(['/tasks']);

  }

}