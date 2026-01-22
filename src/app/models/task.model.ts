export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
}
