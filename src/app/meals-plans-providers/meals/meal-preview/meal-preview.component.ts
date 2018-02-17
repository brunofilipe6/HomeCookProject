import { Component, Input, Output, EventEmitter, ElementRef  } from '@angular/core';
import { NotificationsService } from '../../../shared/notifications.service';

@Component({
  selector: 'meal-preview',
  template: require('./meal-preview.html')
})

export class MealPreviewComponent {

  /** Variables Input */
  @Input() recipe;
  /** servings element recipe */
  @Input() servings; 
  /** time of meal */
  @Input() mealTime;
  /** Boolean to show/hide servings */
  @Input() showServings = true;

  /** Variables output */
  @Output() updateServings = new EventEmitter();

  /** Variables output */
  @Output() openRecipeDetail = new EventEmitter();

  /** Constructor */
  constructor(private _elementRef: ElementRef, private _notificationsService: NotificationsService) {
  }

  openDetail() {
      this.openRecipeDetail.emit();
  }

  /** update servings number */
  updateNumberOfServings(event, optionValue) {
    event.stopPropagation();
    event.preventDefault();

    /** Servings == 1, at least */
    if ((this.servings + optionValue) >= 1) {
      this.updateServings.emit({servings: this.servings + optionValue});
      this._notificationsService.success('Nº de doses da refeição atualizado.')
    }
  }

}
