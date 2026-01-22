import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },

      {
        path: 'tasks',
        loadComponent: () =>
          import('./app/components/task-list/task-list.component')
            .then(m => m.TaskListComponent)
      },
      {
        path: 'add',
        loadComponent: () =>
          import('./app/components/task-form/task-form.component')
            .then(m => m.TaskFormComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./app/components/task-edit/task-edit.component')
            .then(m => m.TaskEditComponent)
      }
    ])
  ]
}).catch(err => console.error(err));
