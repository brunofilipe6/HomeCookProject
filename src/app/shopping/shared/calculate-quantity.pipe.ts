import { Pipe, PipeTransform } from '@angular/core';
import { ShoppingItemModel } from './shopping-item.model';

/**
 * Calculates quantity of a shopping item model
 */
@Pipe({
  name: 'quantity'
})
export class CalculateQuantityPipe implements PipeTransform {
  transform(item: ShoppingItemModel, args: string[]) {
    if(!item.unit.aggregate) {
      return item.recipeQuantity;
    }
    else {
      return (item.mealServings / item.recipeServings) * item.recipeQuantity; // toFixed(3);
    }
  }
}