import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';

const STORAGE_KEY = 'tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks$ = new BehaviorSubject<Task[]>(this.loadTasks());

  private loadTasks(): Task[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data
      ? JSON.parse(data)
      : [
          {
  id: 1,
  title: 'Learn Angular',
  description: 'Standalone FTW',
  dueDate: '2026-01-31',
  category: 'Study',
  priority: 'High',
  completed: false
}

        ];
  }

  private save(tasks: Task[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    this.tasks$.next(tasks);
  }

  getTasks() {
    return this.tasks$.asObservable();
  }

  addTask(task: Task) {
    this.save([...this.tasks$.value, task]);
  }

  deleteTask(id: number) {
    this.save(this.tasks$.value.filter(t => t.id !== id));
  }

  toggleComplete(id: number) {
    const updated = this.tasks$.value.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    this.save(updated);
  }
  getTaskById(id: number): Task | undefined {
  return this.tasks$.value.find(t => t.id === id);
}

updateTask(updated: Task) {
  const tasks = this.tasks$.value.map(t =>
    t.id === updated.id ? updated : t
  );
  this.save(tasks);
}

}
