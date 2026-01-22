import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../models/task.model';

@Pipe({
  name: 'taskFilter',
  standalone: true
})
export class TaskFilterPipe implements PipeTransform {
  transform(tasks: Task[], completed: boolean) {
    return tasks.filter(t => t.completed === completed);
  }
}
