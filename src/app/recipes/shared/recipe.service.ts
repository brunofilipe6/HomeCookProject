import { Injectable, EventEmitter } from '@angular/core';
import { URLSearchParams,RequestOptions } from '@angular/http';

import { HttpManager } from '../../shared/http.manager';
import { StorageService } from '../../shared/storage.service';
import { RecipeModel } from './recipe.model';
import { IngredientModel} from '../../recipes/shared/ingredient.model';
import { UnitModel } from '../../recipes/shared/unit.model';
import { RecipeIngredientLineModel } from '../../recipes/shared/recipe-ingredient-line.model';
import { RecipeInsert } from '../../recipes/shared/recipe-insert.model';
import { GroupModel } from '../../shared/checkbox-group/group.model';

@Injectable()
export class RecipeService {
  endpoint: String = 'recipes';
  apiUrl_groups: String = 'groups';

  constructor(private _httpManager: HttpManager, private _storageService: StorageService) { }
  
  /**
   * Gets recipes based on passed parameters
   * 
   * @param {any} [{search = '', isNovelty = false, isFavorite = false, rating = '', price = '', time = ''}={}]
   * @returns {Promise<RecipeModel[]>}
   * 
   * @memberOf RecipeService
   */
  getRecipes({
              search = '', 
              isMyRecipes = false,isNovelty = false, isFavorite = false, 
              breakfastOrOther = '', groups = [], providerId = '', 
              rating = '', price = '', time = '', 
              skip = 0, limit = 100
            } = {}): Promise<RecipeModel[]> { 
    let params: URLSearchParams = new URLSearchParams();
    params.set('search', search);
    params.set('isMyRecipes', isMyRecipes.toString());
    params.set('isNovelty', isNovelty.toString());
    params.set('isFavorite', isFavorite.toString());
    params.set('groups', groups.join().toString());
    if(breakfastOrOther) params.set('isBreakfast', breakfastOrOther.toString());
    if(providerId) params.set('userid', providerId);
    if(rating) params.set('rating', rating);
    if(price) params.set('price', price);
    if(time) params.set('time', time);
    params.set('skip',skip.toString());
    params.set('limit', limit.toString());

    return this._httpManager.getAll(this.endpoint, new RequestOptions({
      search: params
    })).map(this.listOfRecipes)
      .toPromise();
  }

  getSuggestions(): Promise<RecipeModel[]>{
    return this._httpManager.getAll(`${this.endpoint}/suggestions`).map(this.listOfRecipes)
      .toPromise();
  }
  
  getRecipe(id): Promise<RecipeModel>{
    return this._httpManager.get(this.endpoint,id).map((recipe:any) => {
      return RecipeModel.getInstance(recipe);
    })
    .toPromise();
  }

  getIngredientsRecipe(id){
    return this._httpManager.getAll(this.endpoint+'/'+ id +'/ingredients/').map(this.listIngredients)
      .toPromise();
  }

  getIngredientsUnits(){
    return this._httpManager.getAll('units').map(this.listUnits)
      .toPromise();
  }

  getAllIngredients(){
    return this._httpManager.getAll('ingredients').map(this.ingredients)
      .toPromise();
  }

  private ingredients(list:any): IngredientModel[]{
    return list.map(ing => {
      return new IngredientModel(
        ing.id,
        ing.name);
    })
  }

  private listUnits(list:any): UnitModel[] {
    return list.map(unit => {
      return new UnitModel(
        unit.id,
        unit.name,
        unit.aggregate,
        unit.abbreviation);
    })
  }

  /**
   * 
   * 
   * @private
   * @param {*} list
   * @returns {RecipeModel[]}
   * 
   * @memberOf RecipeService
   */
  private listOfRecipes(list: any): RecipeModel[] {
    return list.map(recipe => {
      return RecipeModel.getInstance(recipe);
    });
  }

  private listIngredients(list:any): RecipeIngredientLineModel[]{
    return list.map(res => {
      return new RecipeIngredientLineModel(
          res.id,
          res.quantity,
          new UnitModel(res.unit.id, res.unit.name, res.unit.aggregate, res.unit.abbreviation),
          new IngredientModel(res.ingredient.id, res.ingredient.name),
          res.recipeId
      ) 
    })
  }

  /**
   * Gets gets the ingredients from one recipe
   * 
   * @params id
   * @returns {Promise<RecipeIngredientLineModel[]>}
   * 
   * @memberOf RecipeService
   */
  getIngredients(id): Promise<RecipeIngredientLineModel[]> {

    return this._httpManager.getAll(this.endpoint + "/" +  id + "/ingredients")
      .map(this.listOfIngredients)
      .toPromise();
  }

  /**
   * 
   * 
   * @private
   * @param {*} list
   * @returns {RecipeIngredientLineModel[]}
   * 
   * @memberOf RecipeService
   */
  private listOfIngredients(list: any): RecipeIngredientLineModel[] {
    return list.map(ingredient => {
      return new RecipeIngredientLineModel(
        ingredient.id,
        ingredient.quantity,
        ingredient.unit,
        ingredient.ingredient,
        ingredient.recipeId);
    });
  }

  removeIngredientInRecipe(ingredient: RecipeIngredientLineModel){
    return this._httpManager.delete(this.endpoint+'/'+'ingredients',ingredient.id)
      .toPromise();
  }

  saveRecipeGroups(recipeId : number, recipeGroups : GroupModel[]){
    var groups: any;
    groups = {groups: recipeGroups};
    return this._httpManager.post(this.endpoint+"/"+recipeId+"/groups", groups)
      .toPromise(); 
  }
  /**
   * Saves the recipe edited recipe
  */
  
  // Alteracao aqui 
  saveIngredientInRecipe(ingredient: RecipeIngredientLineModel, RecipeID: number): Promise<any> {
    console.log(ingredient.id);
    if(ingredient.id < 0){
      console.log(ingredient.id);
      return this._httpManager.post(this.endpoint+'/'+RecipeID+'/'+'ingredients',ingredient) 
       .toPromise();
    }
    else{
      return this._httpManager.put(this.endpoint+'/'+RecipeID+'/'+'ingredients',ingredient.id, ingredient) 
       .toPromise();
    }
  }

  saveRecipeEdit(recipeSettings: RecipeModel): Promise<any> {  
       return this._httpManager.put(this.endpoint, recipeSettings.id,recipeSettings) 
        .map((res: any) => 
          new RecipeInsert(
            res.id,
            res.name,
            res.description,
            res.image,
            res.servings,
            res.price,
            res.time, 
            res.difficulty,
            res.userId,
            res.isBreakfast))
       .toPromise();
  }

    saveRecipeCreate(recipeSettings: RecipeModel): Promise<any> { 
      return this._httpManager.post(this.endpoint, recipeSettings) 
       .map((res: any) => 
          new RecipeInsert(
            res.id,
            res.name,
            res.description,
            res.image,
            res.servings,
            res.price,
            res.time,
            res.difficulty,
            res.userId,
            res.isBreakfast))
       .toPromise();
    }

  /**
   * Update favorite value
   * 
   * @params recipe
   * @returns {Promise<any>}
   * 
   * @memberOf RecipeService
   */
  updateFavorite(recipe: RecipeModel): Promise<any> {
    return this._httpManager.patch(this.endpoint, recipe.id, { isFavorite: recipe.isFavorite })
      .map(res => res)
      .toPromise();
  }

  /**
   * Deletes the received recipe.
   * 
   */
  delete(recipe: RecipeModel): Promise<any> {
    return this._httpManager.delete(this.endpoint,recipe.id)
      .map(res => res)
      .toPromise();
  }

  getGroupsRecipe(recipeId : number): Promise<GroupModel[]>{
    return this._httpManager.getAll(this.endpoint+"/"+recipeId+"/groups")
      .map(this.formatGroups)
      .toPromise();
  }

  private formatGroups(res: any): GroupModel[] {
    return res.map(group => {
      return new GroupModel(
        group.groupId,
        group.groupName,
        true);
    });
  }

  /**
   * Gets recipes based on passed parameters
   * 
   * @param {any} [{search = '', isNovelty = false, isFavorite = false, rating = '', price = '', time = ''}={}]
   * @returns {Promise<RecipeModel[]>}
   * 
   * @memberOf RecipeService
   */
  getGroups(): Promise<GroupModel[]> {
    return this._httpManager.getAll(this.apiUrl_groups).map(this.listOfGroups)
      .toPromise();
  }
  
  /**
   * Map groups, all groups returned
   * 
   * @private
   * @param {*} list
   * @returns {GroupModel[]}
   * 
   * @memberOf GroupService
   */
  private listOfGroups(list: any): GroupModel[] {
    return list.map(group => {
      return new GroupModel(
        group.id,
        group.name,
        false);
    });
  }
}
