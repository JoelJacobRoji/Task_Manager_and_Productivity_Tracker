import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[priorityHighlight]',
  standalone: true
})
export class PriorityHighlightDirective implements OnInit {
  @Input() priority!: string;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.priority === 'High') {
      this.el.nativeElement.style.borderLeft = '6px solid red';
    }
  }
}

