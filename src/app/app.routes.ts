import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./components/task-list/task-list.component').then(component => component.TaskListComponent)
  },
  {
    path: 'add-task',
    loadComponent: () =>
      import('./components/task-form/task-form.component').then(component => component.TaskFormComponent)
  },
  { path: 'add', redirectTo: 'add-task', pathMatch: 'full' },
  {
    path: 'task/:id',
    loadComponent: () =>
      import('./components/task-detail/task-detail.component').then(component => component.TaskDetailComponent)
  },
  {
    path: 'completed',
    loadComponent: () =>
      import('./components/completed-tasks/completed-tasks.component').then(
        component => component.CompletedTasksComponent
      )
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/task-edit/task-edit.component').then(component => component.TaskEditComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'tasks' }
];
