import { UnitModel } from './unit.model';
import { IngredientModel } from './ingredient.model';

export class RecipeIngredientLineModel{

  constructor(
      public id: number,
      public quantity: number,
      public unit: UnitModel,
      public ingredient: IngredientModel,
      public recipeId: number) { }
}
