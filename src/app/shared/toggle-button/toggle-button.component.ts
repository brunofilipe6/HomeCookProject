import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'toggle-button',
  template: require('./toggle-button.html')
})
export class ToggleButtonComponent {
  @Input() toggle: Boolean = false;
  @Output() toggleChange = new EventEmitter();

  clicked() {
    this.toggle = !this.toggle;
    this.toggleChange.emit(this.toggle);
  }
}
