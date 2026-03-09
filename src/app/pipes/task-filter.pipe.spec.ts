import { TaskFilterPipe } from './task-filter.pipe';
import { Task } from '../models/task.model';

describe('TaskFilterPipe', () => {
  const tasks: Task[] = [
    {
      id: 1,
      title: 'A',
      description: 'A',
      dueDate: '2026-03-10',
      category: 'Work',
      priority: 'High',
      completed: false
    },
    {
      id: 2,
      title: 'B',
      description: 'B',
      dueDate: '2026-03-11',
      category: 'Personal',
      priority: 'Low',
      completed: true
    }
  ];

  it('filters by completion', () => {
    const pipe = new TaskFilterPipe();
    const output = pipe.transform(tasks, { completion: 'completed' });

    expect(output.length).toBe(1);
    expect(output[0].id).toBe(2);
  });

  it('filters by priority and category', () => {
    const pipe = new TaskFilterPipe();
    const output = pipe.transform(tasks, { priority: 'High', category: 'Work' });

    expect(output.length).toBe(1);
    expect(output[0].id).toBe(1);
  });
});
