import { IngredientModel } from './ingredient.model';
import { UnitModel } from '../../recipes/shared/unit.model';

// One shopping item defined as: 
// one ingredient needed for a certain meal - defined by a user, recipe, date and meal time - on
// a certain quantity and unit.

export class ShoppingItemModel {
  constructor(
    public id: number,
    public userId: number,
    public date: Date,
    public mealTime: string,
    public recipeId: number,
    public mealServings: number,
    public recipeServings: number,
    public recipeQuantity: number,
    public quantityChecked: number,
    public unit: UnitModel,
    public ingredient: IngredientModel) { }

  get mealTimePT() {
    switch (this.mealTime) {
      case 'Breakfast': return 'Pequeno-almoço';
      case 'Lunch': return 'Almoço';
      case 'Dinner': return 'Jantar';
    }
    
    return this.mealTime;
  }

}