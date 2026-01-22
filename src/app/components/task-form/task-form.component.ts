import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TaskService } from '../../services/task.service';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-task-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterModule
  ],
  template: `
  <div class="form-page">
  <mat-card class="form-card">
    <h2 class="form-title">✨ Add New Task</h2>

    <form [formGroup]="form" (ngSubmit)="submit()">

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Title</mat-label>
        <input matInput formControlName="title" placeholder="Eg: Study networking" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Description</mat-label>
        <textarea
          matInput
          rows="3"
          formControlName="description"
          placeholder="Optional details…"
        ></textarea>
      </mat-form-field>

      <div class="form-row">
        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Category</mat-label>
          <input matInput formControlName="category" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="half-width">
          <mat-label>Priority</mat-label>
          <select matNativeControl formControlName="priority">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Due Date</mat-label>
        <input matInput type="date" formControlName="dueDate" />
      </mat-form-field>

     <div class="form-actions">
  <button mat-button routerLink="/tasks">
    ← Back
  </button>

  <button mat-raised-button color="primary" type="submit">
    ➕ Add Task
  </button>
</div>
    </form>
  </mat-card>
</div>
`
})
export class TaskFormComponent {
  form; // 👈 ONLY declaration, NO initialization here
  goBack() {
  this.router.navigate(['/tasks']);
}

constructor(
  private fb: FormBuilder,
  private taskService: TaskService,
  private router: Router
) {
  this.form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    dueDate: ['', Validators.required],
    category: ['General'],
    priority: ['Medium']
  });
}

  submit() {
    const { title, description, dueDate, category } = this.form.getRawValue();
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
