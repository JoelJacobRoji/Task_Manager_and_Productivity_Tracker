import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { PriorityHighlightDirective } from '../../directives/priority-highlight.directive';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  standalone: true,
  selector: 'app-task-list',
  imports: [
  CommonModule,
  MatCardModule,
  MatButtonModule,
  MatCheckboxModule,
  MatProgressBarModule,
  RouterModule,
  PriorityHighlightDirective
],
  styleUrls: ['./task-list.component.css'],
  template: `
  <div style="margin: 20px 0;">
  <p>
    Completed {{ completedCount }} / {{ tasks.length }} tasks
  </p>

  <mat-progress-bar
    mode="determinate"
    [value]="completionPercent">
  </mat-progress-bar>
</div>
  <div class="tasks-page">

  <!-- FILTERS -->
  <div class="filter-bar">
    <button mat-button (click)="filter='all'">All</button>
    <button mat-button (click)="filter='pending'">Pending</button>
    <button mat-button (click)="filter='completed'">Completed</button>
  </div>

  <!-- TASKS -->
  <div class="tasks-container">
  <mat-card
  class="task-card"
  *ngFor="let task of filteredTasks()"
  [appPriorityHighlight]="task.priority"
>
    <div style="display:flex; justify-content:space-between;">

      <!-- LEFT -->
      <div>
        <mat-checkbox
          [checked]="task.completed"
          (change)="toggle(task.id)"
        >
          <span
            class="task-title"
            [style.textDecoration]="task.completed ? 'line-through' : 'none'"
            [style.opacity]="task.completed ? 0.4 : 1"
          >
            {{ task.title }}
          </span>
        </mat-checkbox>

        <p class="task-muted">{{ task.description }}</p>
        <p
  class="task-muted"
  [style.color]="isOverdue(task) ? '#ff6b6b' : ''"
>
  Due: {{ task.dueDate | date }}
</p>

        <p class="task-muted">
          {{ task.category }} · {{ task.priority }}
        </p>
      </div>

      <!-- RIGHT -->
      <div class="task-actions">
        <button mat-button (click)="delete(task.id)">Delete</button>
        <br />
        <button mat-button [routerLink]="['/edit', task.id]">Edit</button>
      </div>

    </div>
  </mat-card>

</div>
  `
})

export class TaskListComponent {
  tasks: Task[] = [];
  filter: 'all' | 'completed' | 'pending' = 'all';


  constructor(private taskService: TaskService) {
    this.taskService.getTasks().subscribe(t => (this.tasks = t));
  }

  toggle(id: number) {
    this.taskService.toggleComplete(id);
  }

  delete(id: number) {
    this.taskService.deleteTask(id);
  }

  get completedCount(): number {
  return this.tasks.filter(t => t.completed).length;
}

  get completionPercent(): number {
  if (this.tasks.length === 0) return 0;

  const completed = this.tasks.filter(t => t.completed).length;
  return (completed / this.tasks.length) * 100;
}

isOverdue(task: Task): boolean {
  if (task.completed) return false;

  const today = new Date();
  const due = new Date(task.dueDate);

  return due < today;
}

  filteredTasks() {
    if (this.filter === 'completed') {
      return this.tasks.filter(t => t.completed);
    }
    if (this.filter === 'pending') {
      return this.tasks.filter(t => !t.completed);
    }
    return this.tasks;
  }
}

