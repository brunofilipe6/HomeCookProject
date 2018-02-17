import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { HttpManager } from '../../../shared/http.manager';
import { StorageService } from '../../../shared/storage.service';
import { PlanModel } from './plan.model';
import { PlanMealModel } from './plan-meal.model';
import { RecipeModel } from './../../../recipes/shared/recipe.model';
import { ProviderModel } from '../../providers/shared/provider.model';

@Injectable()
export class PlanService {
  endpoint = 'plans';

  constructor(private _httpManager: HttpManager, private _storageService: StorageService) { }

  /**
   * Get all plans
   * 
   * @returns {Promise<PlanModel[]>}
   * 
   * @memberOf PlanService
   */
  getPlans(): Promise<PlanModel[]> {
    return this._httpManager.getAll(this.endpoint)
      .map(this.listOfPlans)
      .toPromise();
  }

  /**
   * Get bought plans
   * 
   * @returns {Promise<PlanModel[]>}
   * 
   * @memberOf PlanService
   */
  getBoughtPlans(): Promise<PlanModel[]> {
    return this._httpManager.getAll(this.endpoint, new RequestOptions({
      headers: new Headers({
        'filter-bought': true
      })
    })).map(this.listOfPlans)
      .toPromise();
  }

  /**
   * Get plans of the user
   * Method only used by the provider
   * 
   * @returns {Promise<PlanModel[]>}
   * 
   * @memberOf PlanService
   */
  getOwnPlans(): Promise<PlanModel[]> {
    return this._httpManager.getAll(this.endpoint, new RequestOptions({
      headers: new Headers({
        'filter-owner': true
      })
    })).map(this.listOfPlans)
      .toPromise();
  }

  /**
   * Returns list of plans created by current user
   * 
   * @returns {Promise<PlanModel[]>}
   * 
   * @memberOf PlanService
   */
  getProviderPlans({providerId = 0, skip = 0, limit = 100 }): Promise<PlanModel[]> {
    
    let params: URLSearchParams = new URLSearchParams();
    params.set('skip',skip.toString());
    params.set('limit', limit.toString());

    return this._httpManager.getAll(this.endpoint, new RequestOptions({
      search: params,
      headers: new Headers({
        'filter-providerId': providerId
      })
    })).map(this.listOfPlans)

      .toPromise();
  }

  /**
   * Returns a plan.
   */
  getPlan(id): Promise<PlanModel> {
    return this._httpManager.get(this.endpoint, id)
      .map((m: any) => {
        return new PlanModel(
          m.id,
          m.title,
          m.description,
          m.minPrice,
          m.maxPrice,
          m.planType,
          new ProviderModel(
            m.provider.user.id,
            m.provider.user.username,
            m.provider.job,
            m.provider.picture
          ),
          m.bought
        );
      })
      .toPromise();
  }

  /**
   * Returns list of meals inside received plan id.
   */
  getPlanMeals(id): Promise<PlanMealModel[]> {
    return this._httpManager.getAll(this.endpoint + '/' + id + '/meals')
      .map(this.listOfPlanMeals)
      .toPromise();
  }

  /**
   * Saves the received plan - new or edited one.
   */
  save(plan: PlanModel): Promise<any> {
    if (plan.id) {
      return this._httpManager.put(this.endpoint, plan.id, plan)
        .map(
        (m: any) => {
          return new PlanModel(
            m.id,
            m.title,
            m.description,
            m.minPrice,
            m.maxPrice,
            m.planType,
            null,
            m.bought
          );
        }
        )
        .toPromise();
    } else {
      return this._httpManager.post(this.endpoint, plan)
        .map(
        (m: any) => {
          return new PlanModel(
            m.id,
            m.title,
            m.description,
            m.minPrice,
            m.maxPrice,
            m.planType,
            null,
            m.bought
          );
        }
        )
        .toPromise();
    }
  }

  /**
   * Deletes the received plan.
   */
  delete(plan: PlanModel): Promise<any> {
    return this._httpManager.delete(this.endpoint, plan.id)
      .toPromise();
  }

  /**
   * Saves the received plan meal - new or edited one.
   */
  saveMeal(planMeal: PlanMealModel): Promise<any> {
    if (planMeal.id) {
      return this._httpManager.put(this.endpoint + '/' + planMeal.planId + '/meals', planMeal.id, planMeal)
        .map((m: any) => {
          var recipe = m.recipe;
          recipe.recipeIngredientLines = [];

          return new PlanMealModel(
            m.id,
            m.planId,
            m.day,
            m.mealTime,
            RecipeModel.getInstance(recipe)
          );
        })
        .toPromise();
    } else {
      return this._httpManager.post(this.endpoint + '/' + planMeal.planId + '/meals', planMeal)
        .map(
        (m: any) => {
          var recipe = m.recipe;

          return new PlanMealModel(
            m.id,
            m.planId,
            m.day,
            m.mealTime,
            RecipeModel.getInstance(recipe)
          );
        })
        .toPromise();
    }
  }

  /** 
   * Deletes the received plan meal.
   */
  deleteMeal(planMeal: PlanMealModel): Promise<any> {
    return this._httpManager.delete(this.endpoint + '/' + planMeal.planId + '/meals', planMeal.id)
      .toPromise();
  }

  /**
   * Casting method to plan model instances.
   */
  private listOfPlans(list: any): PlanModel[] {
    return list.map(m => {
      return new PlanModel(
        m.id,
        m.title,
        m.description,
        m.minPrice,
        m.maxPrice,
        m.planType,
        new ProviderModel(
          m.provider.user.id,
          m.provider.user.username,
          m.provider.job,
          m.provider.picture
        ),
        m.bought
      );
    });
  }

  /**
   * Casting method to plan meal model instances.
   */
  private listOfPlanMeals(list: any): PlanMealModel[] {
    return list.map(m => {
      var recipe = m.recipe;
      recipe.recipeIngredientLines = [];
      
      return new PlanMealModel(
        m.id,
        m.planId,
        m.day,
        m.mealTime,
        RecipeModel.getInstance(recipe)
      );
    });
  }
}