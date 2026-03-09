import { Entity } from './entity.model';

export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  category: string;
  priority: TaskPriority;
  completed: boolean;
}

export class TaskModel extends Entity implements Task {
  constructor(
    id: number,
    public title: string,
    public description: string,
    public dueDate: string,
    public category: string,
    public priority: TaskPriority,
    public completed: boolean
  ) {
    super(id);
  }

  get isOverdue(): boolean {
    if (this.completed) {
      return false;
    }

    return new Date(this.dueDate).getTime() < Date.now();
  }
}
