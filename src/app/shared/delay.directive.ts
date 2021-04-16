import { Directive, OnInit, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[fgDelay]'
})
export class DelayDirective implements OnInit {

  @Input() fgDelay = 1000; // ms

  constructor(
    private TemplateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.viewContainerRef.createEmbeddedView(this.TemplateRef);
    },
    this.fgDelay);
  }
}
