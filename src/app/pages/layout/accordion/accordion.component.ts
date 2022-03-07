import { Component, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'ngx-accordion',
  templateUrl: 'accordion.component.html',
  styleUrls: ['accordion.component.scss'],
})
export class AccordionComponent {

  @ViewChild('item', { static: true }) accordion;
  @Input() title: string;
  @Input() item1: string;
  @Input() item2: string;
  @Input() item3: string;

  toggle() {
    this.accordion.toggle();
  }
}
