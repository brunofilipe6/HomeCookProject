import {IngredientModel} from '../../recipes/shared/ingredient.model'
import {UnitModel} from '../../recipes/shared/unit.model'

export class ListIngred {
    constructor(
        public product: IngredientModel,
        public quantit: Number,
        public unit: UnitModel)
       { }
}