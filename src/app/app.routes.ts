import { Routes } from '@angular/router';

import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { CompletedTasksComponent } from './components/completed-tasks/completed-tasks.component';
import { TaskEditComponent } from './components/task-edit/task-edit.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  { path: '', component: TaskListComponent },

  { path: 'add-task', component: TaskFormComponent },

  { path: 'task/:id', component: TaskDetailComponent },

  { path: 'completed', component: CompletedTasksComponent },

  { path: 'edit/:id', component: TaskEditComponent, canActivate: [authGuard] }

];