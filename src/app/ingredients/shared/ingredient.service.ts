import { Injectable, EventEmitter } from '@angular/core';
import { URLSearchParams, RequestOptions } from '@angular/http';

import { HttpManager } from '../../shared/http.manager';
import { IngredientModel } from './ingredient.model';
import { IngredientCategoryModel } from './ingredient-category.model';

@Injectable()
export class IngredientService {
  endpoint: String = 'ingredients';

  constructor(private _httpManager: HttpManager) { }

  public getIngredients(): Promise<IngredientModel[]> {
    return this._httpManager.getAll(this.endpoint).map(this.listOfIngredients)
      .toPromise();
  }

  public getOtherIngredients(): Promise<IngredientModel[]> {
    return this._httpManager.getAll(`${this.endpoint}/1`).map(this.listOfIngredients)
      .toPromise();
  }

  public getIngredientCategories(): Promise<IngredientCategoryModel[]> {
    return this._httpManager.getAll('ingredientCategories').map(this.listOfIngredientCategories)
      .toPromise();
  }

  public putIngredient(id: Number, ingredient: IngredientModel) {
    return this._httpManager.put(this.endpoint, id, ingredient).map(res => res)
      .toPromise();
  }

  private listOfIngredients(list: any): IngredientModel[] {
    return list.map(res => {
      return new IngredientModel(
        res.id,
        res.name,
        res.categoryId
      )
    })
  }

  private listOfIngredientCategories(list: any): IngredientCategoryModel[] {
    return list.map(res => {
      return new IngredientCategoryModel(
        res.id,
        res.name
      )
    })
  }

}
