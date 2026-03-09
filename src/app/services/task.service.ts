import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { Task, TaskPriority } from '../models/task.model';
import { API_BASE_URL } from '../config/api.config';

export interface TaskFilterOptions {
  completion?: 'all' | 'completed' | 'pending';
  priority?: TaskPriority | 'all';
  category?: string | 'all';
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly tasksSubject = new BehaviorSubject<Task[]>([]);
  private readonly tasksEndpoint = `${API_BASE_URL}/tasks`;

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
    return this.http.post<Task>(this.tasksEndpoint, task).pipe(
      switchMap(() => this.refreshTasks()),
      catchError(() => of(this.tasksSubject.value))
    );
  }

  updateTask(updatedTask: Task): Observable<Task[]> {
    return this.http.put<Task>(`${this.tasksEndpoint}/${updatedTask.id}`, updatedTask).pipe(
      switchMap(() => this.refreshTasks()),
      catchError(() => of(this.tasksSubject.value))
    );
  }

  deleteTask(id: number): Observable<Task[]> {
    return this.http.delete<void>(`${this.tasksEndpoint}/${id}`).pipe(
      switchMap(() => this.refreshTasks()),
      catchError(() => of(this.tasksSubject.value))
    );
  }

  toggleComplete(id: number): Observable<Task[]> {
    const task = this.getTaskById(id);
    if (!task) {
      return of(this.tasksSubject.value);
    }

    return this.updateTask({ ...task, completed: !task.completed });
  }

  getCategories(): Category[] {
    return this.categories;
  }

  private loadInitialTasks(): void {
    this.refreshTasks()
      .pipe(
        catchError(() =>
          this.http.get<Task[]>('mock/tasks.json').pipe(
            map(tasks => this.sortTasksByDate(tasks)),
            tap(tasks => this.tasksSubject.next(tasks)),
            catchError(() => {
              this.tasksSubject.next([]);
              return of([]);
            })
          )
        )
      )
      .subscribe();
  }

  private refreshTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksEndpoint).pipe(
      map(tasks => this.sortTasksByDate(tasks)),
      tap(tasks => this.tasksSubject.next(tasks))
    );
  }

  private sortTasksByDate(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }
}
