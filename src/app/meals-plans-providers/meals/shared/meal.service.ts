import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { HttpManager } from '../../../shared/http.manager';
import { MealModel } from './meal.model';
import { RecipeModel } from './../../../recipes/shared/recipe.model';

@Injectable()
export class MealService {
  endpoint = 'meals';

  constructor(private _httpManager: HttpManager) { }

  /**
   * Returns list of scheduled meals in the received date range.
   */
  getMeals(from: Date, until: Date): Promise<MealModel[]> {
    return this._httpManager.getAll(this.endpoint, new RequestOptions({
      headers: new Headers({
        'filter-from': from,
        'filter-until': until
      })
    })).map(this.listOfMeals)
      .toPromise();
  }

  /**
   * Saves the received meal - new or edited one.
   */
  save(meal: MealModel): Promise<any> {
    if (meal.id) {
      return this._httpManager.put(this.endpoint, meal.id, meal)
        .map((m: any) => {
          return new MealModel(
            m.id,
            new Date(m.date),
            m.mealTime,
            RecipeModel.getInstance(m.recipe),
            m.servings
          );
        })
        .toPromise();
    } else {
      return this._httpManager.post(this.endpoint, meal)
        .map((m: any) => {
          return new MealModel(
            m.id,
            new Date(m.date),
            m.mealTime,
            RecipeModel.getInstance(m.recipe),
            m.servings
          );
        })
        .toPromise();
    }
  }

  /**
   * Deletes the received meal.
   */
  delete(meal: MealModel): Promise<any> {
    return this._httpManager.delete(this.endpoint, meal.id)
      .toPromise();
  }

  /**
   * 
   * 
   * @param {PlanModel} plan
   * @returns
   * 
   * @memberOf MealService
   */
  addPlanToMeals(planId: Number, startDate: String) {
    return this._httpManager.post(`${this.endpoint}/add_plan_to_meals/${planId}`, { }, new RequestOptions({
      headers: new Headers({
        'start-date': startDate,
      })
    })).toPromise();
  }

  /**
   * Casting method.
   */
  private listOfMeals(list: any): MealModel[] {
    return list.map(m => {
      return new MealModel(
        m.id,
        new Date(m.date),
        m.mealTime,
        RecipeModel.getInstance(m.recipe),
        m.servings
      );
    });
  }
}