import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  const baseTasks: Task[] = [
    {
      id: 1,
      title: 'Task one',
      description: 'First task',
      dueDate: '2026-03-20',
      category: 'Work',
      priority: 'High',
      completed: false
    },
    {
      id: 2,
      title: 'Task two',
      description: 'Second task',
      dueDate: '2026-03-21',
      category: 'Personal',
      priority: 'Low',
      completed: true
    }
  ];

  let service: TaskService;

  beforeEach(() => {
    localStorage.setItem('tasks', JSON.stringify(baseTasks));

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(TaskService);
  });

  afterEach(() => {
    localStorage.removeItem('tasks');
  });

  it('loads tasks from local storage', async () => {
    const tasks = await firstValueFrom(service.getTasks());
    expect(tasks.length).toBe(2);
    expect(tasks[0].title).toBe('Task one');
  });

  it('supports add, update, toggle, and delete operations', async () => {
    const newTask: Task = {
      id: 3,
      title: 'Task three',
      description: 'Third task',
      dueDate: '2026-03-25',
      category: 'Learning',
      priority: 'Medium',
      completed: false
    };

    const addedTasks = await firstValueFrom(service.addTask(newTask));
    expect(addedTasks.find(task => task.id === 3)).toBeTruthy();

    const updatedTasks = await firstValueFrom(service.updateTask({ ...newTask, title: 'Updated task' }));
    expect(updatedTasks.find(task => task.id === 3)?.title).toBe('Updated task');

    const toggledTasks = await firstValueFrom(service.toggleComplete(3));
    expect(toggledTasks.find(task => task.id === 3)?.completed).toBe(true);

    const deletedTasks = await firstValueFrom(service.deleteTask(3));
    expect(deletedTasks.find(task => task.id === 3)).toBeUndefined();
  });

  it('filters tasks by completion, category, and priority', () => {
    const filtered = service.filterTasks(baseTasks, {
      completion: 'completed',
      category: 'Personal',
      priority: 'Low'
    });

    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe(2);
  });
});
