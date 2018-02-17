import { MealModel } from './meal.model'

export class DayMeals {
    constructor(
        public date : Date,
        public breakfast : MealModel,
        public lunch : MealModel,
        public dinner : MealModel) { }

}
