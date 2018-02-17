import { RecipeModel } from '../../../recipes/shared/recipe.model';

export class MealModel {
    constructor(
        public id: Number,
        public date: Date,
        public mealTime: string,
        public recipe: RecipeModel,
        public servings: Number
    ) {
        this.mealTime = this.mealTime.charAt(0).toUpperCase() + this.mealTime.slice(1);
    }

    
    /**
     * Returns possible meal time values.
     */
    static getMealTimes(lowecased) {
        if (lowecased)
            return ['breakfast','lunch','dinner'];
    
        return ['Breakfast','Lunch','Dinner'];
    }
    
    /**
     * Returns translations for meal times for the received locale string.
     * If no locale is received, 'pt' is used. 
     * If no translations are found, returns a object with the original meal time values.
     */
    static getMealTimesTranslations(locale) {

        if (typeof locale == "undefined") {
            locale = 'pt';
        }

        var translations = {
            pt: {
                breakfast: 'Pequeno-almoço',
                lunch: 'Almoço',
                dinner: 'Jantar'
            }
        };

        return typeof translations[locale] !== "undefined"? 
            translations[locale] : 
            {
                breakfast: 'breakfast',
                lunch: 'lunch',
                dinner: 'dinner'
            };
    }
}
