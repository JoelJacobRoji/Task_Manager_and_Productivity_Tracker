import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appPriorityHighlight]',
  standalone: true
})
export class PriorityHighlightDirective implements OnInit {

  @Input('appPriorityHighlight') priority!: 'Low' | 'Medium' | 'High';

  constructor(private el: ElementRef) {}

  ngOnInit() {

    if (this.priority === 'High') {
      this.el.nativeElement.style.borderLeft = '5px solid red';
    }

    if (this.priority === 'Medium') {
      this.el.nativeElement.style.borderLeft = '5px solid orange';
    }

    if (this.priority === 'Low') {
      this.el.nativeElement.style.borderLeft = '5px solid green';
    }

  }

}