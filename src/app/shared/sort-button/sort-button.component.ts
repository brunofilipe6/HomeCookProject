import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sort-button',
  template: require('./sort-button.html')
})
export class SortButtonComponent {
  @Input() sort: String = '';
  @Output() sortChange = new EventEmitter();

  flipSort() {
    if(this.sort == '' || this.sort == 'asc') {
      this.sort = 'desc';
    }
    else {
      this.sort = 'asc';
    }

    this.sortChange.emit(this.sort);
  }

  sortDesc() {
    if(this.sort == '' || this.sort == 'asc') {
      this.sort = 'desc';
    }
    else {
      this.sort = '';
    }

    this.sortChange.emit(this.sort);
  }

  sortAsc() {
    if(this.sort == '' || this.sort == 'desc') {
      this.sort = 'asc';
    }
    else {
      this.sort = '';
    }

    this.sortChange.emit(this.sort);
  }

  get isSortAsc() {
    return this.sort == 'asc';
  }

  get isSortDesc() {
    return this.sort == 'desc';
  }
}
