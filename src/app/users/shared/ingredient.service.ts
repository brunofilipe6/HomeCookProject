import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { HttpManager } from '../../shared/http.manager';
import { IngredientModel } from '../shared/ingredient.model'

@Injectable()
export class IngredientService {
  httpManager: HttpManager;
  apiUrl = 'ingredients';

  constructor(private _httpManager: HttpManager) { }

  getIngredients(): Promise<IngredientModel[]> {
    return this._httpManager.getAll(this.apiUrl)
      .map(this.listOfIngredients)
      .toPromise();
  }

  /**
   * putSettings(userSettings): Promise<Settings> {
    return this._httpManager.putAll(this.apiUrl, userSettings)
      .map((res: any) => new Settings(res.username, res.email, res.servings, new Role(res.role.id, res.role.role)))
      .toPromise();
  }
   */

  private listOfIngredients(list: any): IngredientModel[] {
    return list.map(ingred => {
      return new IngredientModel(
        ingred.id,
        ingred.name,
        ingred.categoryId,
        false);
    });
  }
}