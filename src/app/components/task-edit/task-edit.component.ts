import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TaskService } from '../../services/task.service';

@Component({
  standalone: true,
  selector: 'app-task-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 style="margin:20px;">Edit Task</h2>

    <form [formGroup]="form" (ngSubmit)="save()" style="margin:20px;">
      <mat-form-field style="width:100%;">
        <mat-label>Title</mat-label>
        <input matInput formControlName="title" />
      </mat-form-field>

      <mat-form-field style="width:100%;">
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description"></textarea>
      </mat-form-field>

      <mat-form-field style="width:100%;">
        <mat-label>Due Date</mat-label>
        <input matInput type="date" formControlName="dueDate" />
      </mat-form-field>

      <button mat-raised-button color="primary">Save</button>
    </form>
  `
})
export class TaskEditComponent {
  form;
  taskId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private taskService: TaskService
  ) {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    const task = this.taskService.getTaskById(this.taskId)!;

    this.form = this.fb.nonNullable.group({
      title: [task.title, Validators.required],
      description: [task.description],
      dueDate: [task.dueDate]
    });
  }

  save() {
    const updated = {
      ...this.taskService.getTaskById(this.taskId)!,
      ...this.form.getRawValue()
    };

    this.taskService.updateTask(updated);
    this.router.navigate(['/']);
  }
}
