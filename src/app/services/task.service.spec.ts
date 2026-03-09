import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';
import { API_BASE_URL } from '../config/api.config';

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
  let httpMock: HttpTestingController;

  const endpoint = `${API_BASE_URL}/tasks`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);

    const initialRequest = httpMock.expectOne(endpoint);
    expect(initialRequest.request.method).toBe('GET');
    initialRequest.flush(baseTasks);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads tasks from backend', async () => {
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

    const addPromise = firstValueFrom(service.addTask(newTask));
    const addRequest = httpMock.expectOne(endpoint);
    expect(addRequest.request.method).toBe('POST');
    addRequest.flush(newTask);

    const refreshAfterAdd = httpMock.expectOne(endpoint);
    expect(refreshAfterAdd.request.method).toBe('GET');
    refreshAfterAdd.flush([...baseTasks, newTask]);

    const addedTasks = await addPromise;
    expect(addedTasks.find(task => task.id === 3)).toBeTruthy();

    const updatedTask = { ...newTask, title: 'Updated task' };
    const updatePromise = firstValueFrom(service.updateTask(updatedTask));
    const updateRequest = httpMock.expectOne(`${endpoint}/3`);
    expect(updateRequest.request.method).toBe('PUT');
    updateRequest.flush(updatedTask);

    const refreshAfterUpdate = httpMock.expectOne(endpoint);
    expect(refreshAfterUpdate.request.method).toBe('GET');
    refreshAfterUpdate.flush([...baseTasks, updatedTask]);

    const updatedTasks = await updatePromise;
    expect(updatedTasks.find(task => task.id === 3)?.title).toBe('Updated task');

    const togglePromise = firstValueFrom(service.toggleComplete(3));
    const toggleRequest = httpMock.expectOne(`${endpoint}/3`);
    expect(toggleRequest.request.method).toBe('PUT');
    toggleRequest.flush({ ...updatedTask, completed: true });

    const refreshAfterToggle = httpMock.expectOne(endpoint);
    expect(refreshAfterToggle.request.method).toBe('GET');
    refreshAfterToggle.flush([...baseTasks, { ...updatedTask, completed: true }]);

    const toggledTasks = await togglePromise;
    expect(toggledTasks.find(task => task.id === 3)?.completed).toBe(true);

    const deletePromise = firstValueFrom(service.deleteTask(3));
    const deleteRequest = httpMock.expectOne(`${endpoint}/3`);
    expect(deleteRequest.request.method).toBe('DELETE');
    deleteRequest.flush(null, { status: 204, statusText: 'No Content' });

    const refreshAfterDelete = httpMock.expectOne(endpoint);
    expect(refreshAfterDelete.request.method).toBe('GET');
    refreshAfterDelete.flush(baseTasks);

    const deletedTasks = await deletePromise;
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
