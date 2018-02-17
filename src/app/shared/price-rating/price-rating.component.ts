import { Component, Input } from '@angular/core';

@Component({
  selector: 'price-rating',
  template: require('./price-rating.html')
})
export class PriceRatingComponent {
  @Input() price;
  numbers = [1, 2, 3];
}
