import { RecipeModel } from './../../../recipes/shared/recipe.model'
import { MealModel } from './../../meals/shared/meal.model'

export class PlanMealModel {
    constructor(
        public id : number,
        public planId: number,
        public day: number,
        public mealTime: string,        
        public recipe: RecipeModel,
        ) { }


    /**
     * Returns possible meal time values.
     */
    static getMealTimes(lowercased) {
        return MealModel.getMealTimes(lowercased);
    }
    
    /**
     * Returns translations for meal times for the received locale string.
     * If no locale is received, 'pt' is used. 
     * If no translations are found, returns a object with the original meal time values.
     */
    static getMealTimesTranslations(locale) {
        return MealModel.getMealTimesTranslations(locale);
    }
}
