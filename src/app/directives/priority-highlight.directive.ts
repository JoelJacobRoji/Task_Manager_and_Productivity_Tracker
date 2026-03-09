import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { TaskPriority } from '../models/task.model';

@Directive({
  selector: '[appPriorityHighlight]',
  standalone: true
})
export class PriorityHighlightDirective implements OnChanges {
  @Input('appPriorityHighlight') priority: TaskPriority = 'Medium';
  @Input() dueDate = '';
  @Input() completed = false;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngOnChanges(): void {
    const host = this.el.nativeElement;
    const now = new Date();
    const dueDate = this.dueDate ? new Date(this.dueDate) : null;
    const isOverdue = !!dueDate && !this.completed && dueDate.getTime() < now.getTime();

    if (this.priority === 'High') {
      host.style.borderLeft = '5px solid #ef4444';
    } else if (this.priority === 'Medium') {
      host.style.borderLeft = '5px solid #f59e0b';
    } else {
      host.style.borderLeft = '5px solid #22c55e';
    }

    host.style.background = isOverdue ? 'rgba(239, 68, 68, 0.12)' : '';
  }
}
