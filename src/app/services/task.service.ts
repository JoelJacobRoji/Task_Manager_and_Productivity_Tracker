import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { Task, TaskPriority } from '../models/task.model';

export interface TaskFilterOptions {
  completion?: 'all' | 'completed' | 'pending';
  priority?: TaskPriority | 'all';
  category?: string | 'all';
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly storageKey = 'tasks';
  private readonly tasksSubject = new BehaviorSubject<Task[]>([]);

  readonly tasks$ = this.tasksSubject.asObservable();
  readonly completedTasks$ = this.tasks$.pipe(map(tasks => tasks.filter(task => task.completed)));
  readonly completionPercent$ = this.tasks$.pipe(
    map(tasks => {
      if (!tasks.length) {
        return 0;
      }

      const completedCount = tasks.filter(task => task.completed).length;
      return (completedCount / tasks.length) * 100;
    })
  );

  private readonly categories: Category[] = [
    { id: 1, name: 'General' },
    { id: 2, name: 'Work' },
    { id: 3, name: 'Learning' },
    { id: 4, name: 'Personal' },
    { id: 5, name: 'Health' }
  ];

  readonly priorities: TaskPriority[] = ['Low', 'Medium', 'High'];

  constructor(private readonly http: HttpClient) {
    this.loadInitialTasks();
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  getTaskById(id: number): Task | undefined {
    return this.tasksSubject.value.find(task => task.id === id);
  }

  getTaskById$(id: number): Observable<Task | undefined> {
    return this.tasks$.pipe(map(tasks => tasks.find(task => task.id === id)));
  }

  filterTasks(tasks: Task[], options: TaskFilterOptions): Task[] {
    return tasks.filter(task => {
      const completionMatch =
        options.completion === undefined ||
        options.completion === 'all' ||
        (options.completion === 'completed' && task.completed) ||
        (options.completion === 'pending' && !task.completed);

      const priorityMatch =
        options.priority === undefined ||
        options.priority === 'all' ||
        task.priority === options.priority;

      const categoryMatch =
        options.category === undefined ||
        options.category === 'all' ||
        task.category === options.category;

      return completionMatch && priorityMatch && categoryMatch;
    });
  }

  addTask(task: Task): Observable<Task[]> {
    const nextTasks = this.sortTasksByDate([...this.tasksSubject.value, task]);
    this.persistAndEmit(nextTasks);
    return of(nextTasks);
  }

  updateTask(updatedTask: Task): Observable<Task[]> {
    const nextTasks = this.sortTasksByDate(
      this.tasksSubject.value.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );

    this.persistAndEmit(nextTasks);
    return of(nextTasks);
  }

  deleteTask(id: number): Observable<Task[]> {
    const nextTasks = this.tasksSubject.value.filter(task => task.id !== id);
    this.persistAndEmit(nextTasks);
    return of(nextTasks);
  }

  toggleComplete(id: number): Observable<Task[]> {
    const nextTasks = this.tasksSubject.value.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );

    this.persistAndEmit(nextTasks);
    return of(nextTasks);
  }

  getCategories(): Category[] {
    return this.categories;
  }

  private loadInitialTasks(): void {
    const storedTasks = this.getStoredTasks();

    if (storedTasks.length) {
      this.tasksSubject.next(this.sortTasksByDate(storedTasks));
      return;
    }

    this.http
      .get<Task[]>('mock/tasks.json')
      .pipe(
        catchError(() => of([])),
        map(tasks => this.sortTasksByDate(tasks))
      )
      .subscribe(tasks => this.persistAndEmit(tasks));
  }

  private getStoredTasks(): Task[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as Task[];
    } catch {
      return [];
    }
  }

  private persistAndEmit(tasks: Task[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    this.tasksSubject.next(tasks);
  }

  private sortTasksByDate(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }
}
