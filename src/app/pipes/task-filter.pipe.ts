import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../models/task.model';

export interface TaskPipeFilter {
  completion?: 'all' | 'completed' | 'pending';
  priority?: 'all' | 'Low' | 'Medium' | 'High';
  category?: 'all' | string;
}

@Pipe({
  name: 'taskFilter',
  standalone: true
})
export class TaskFilterPipe implements PipeTransform {
  transform(tasks: Task[] | null, filter: TaskPipeFilter = {}): Task[] {
    if (!tasks) {
      return [];
    }

    return tasks.filter(task => {
      const completionMatch =
        filter.completion === undefined ||
        filter.completion === 'all' ||
        (filter.completion === 'completed' && task.completed) ||
        (filter.completion === 'pending' && !task.completed);

      const priorityMatch =
        filter.priority === undefined || filter.priority === 'all' || task.priority === filter.priority;

      const categoryMatch =
        filter.category === undefined || filter.category === 'all' || task.category === filter.category;

      return completionMatch && priorityMatch && categoryMatch;
    });
  }
}
