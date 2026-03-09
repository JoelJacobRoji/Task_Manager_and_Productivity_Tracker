import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasks: Task[] = [];
  private taskSubject = new BehaviorSubject<Task[]>([]);

  tasks$ = this.taskSubject.asObservable();

  constructor() {
    const saved = localStorage.getItem('tasks');

    if (saved) {
      this.tasks = JSON.parse(saved);
      this.taskSubject.next(this.tasks);
    }
  }

  getTasks() {
    return this.tasks$;
  }

  getTaskById(id: number) {
    return this.tasks.find(t => t.id === id);
  }

  addTask(task: Task) {
    this.tasks.push(task);
    this.updateStorage();
  }

  updateTask(updatedTask: Task) {
    this.tasks = this.tasks.map(t =>
      t.id === updatedTask.id ? updatedTask : t
    );

    this.updateStorage();
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.updateStorage();
  }

  toggleComplete(id: number) {

  const task = this.tasks.find(t => t.id === id);

  if (task) {
    task.completed = !task.completed;
    this.updateStorage();
  }

}

  private updateStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.taskSubject.next(this.tasks);
  }

}