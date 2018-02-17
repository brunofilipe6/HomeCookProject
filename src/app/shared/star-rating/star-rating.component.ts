import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'star-rating',
  template:  require('./star-rating.html')
})
export class StarRatingComponent {
  @Input() rating;
  @Output() ratingChange = new EventEmitter();
  ratingOver: Number = 0;

  numbers = [1,2,3,4,5];
  titles = [
    'Fraco',
    'Razoável',
    'Bom',
    'Muito bom',
    'Delicioso!'
  ];

  mouseOver(event, number) {
    this.ratingOver = number;
  }

  mouseOut(event) {
    this.ratingOver = 0;
  }

  isFilled(number) {
    if(this.ratingOver == 0) {
      return number <= this.rating;
    }
    else {
      return number <= this.ratingOver;
    }
  }

  changeRating(event, rating) {
    event.stopPropagation();
    event.preventDefault();

    this.rating = rating;
    this.ratingChange.emit(rating);
  }
}
