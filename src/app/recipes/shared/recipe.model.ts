import { RecipeIngredientLineModel } from './recipe-ingredient-line.model';
import { GroupModel } from '../../shared/checkbox-group/group.model';

export class RecipeModel {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public showDescription: string,
        public image: string,
        public servings: number,
        public rating: number,
        public price: number,
        public time: number,
        public difficulty: number,
        public isFavorite: Boolean,
        public userId: number,
        public recipeIngredientLines: RecipeIngredientLineModel[],
        public groups: GroupModel[],
        public isBreakfast: string
    ) { }

    get formmatedPrice() {
        let price = this.price || 0;
        return price && price.toLocaleString(undefined, { minimumFractionDigits: 2 }) ;
    }

    getFormmatedPriceWithServings(servings) {
        let price = this.price || 0;
        price *= servings;
        return price && price.toLocaleString(undefined, { minimumFractionDigits: 2 }) ;
    }

    static getInstance(obj) : RecipeModel {
        
        var breakfast = '';
        if(obj.isBreakfast == "0")  {
            breakfast = "1";
        }
        else if(obj.isBreakfast == "1"){
            breakfast = "0";
        }

        return new RecipeModel(
            obj.id,
            obj.name,
            obj.description,
            obj.showDescription,
            obj.image,
            obj.servings,
            obj.rating,
            obj.price,
            obj.time,
            obj.difficulty,
            obj.isFavorite,
            obj.userId,
            obj.recipeIngredientLines || [],
            obj.groups,
            breakfast
        );
    }
}
