import { Component, Input } from '@angular/core';

@Component({
  selector: 'bar-classification',
  template:  require('./bar-classification.html')
})

export class BarClassificationComponent {
  @Input() value;
  numbers = [1,2,3,4,5];
}
