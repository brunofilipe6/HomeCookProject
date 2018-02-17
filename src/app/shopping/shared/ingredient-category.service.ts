import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { IngredientCategoryModel } from './ingredient-category.model';
import { HttpManager } from './../../shared/http.manager';


@Injectable()

export class IngredientCategoryService {

    private _url = "ingredientCategories";

    constructor(private _http: HttpManager) {
    }

    getIngredientCategories(): Promise<IngredientCategoryModel[]> {
        return this._http.getAll(this._url)
            .map(this.listOfCategories)
            .toPromise();
    }

    private listOfCategories(list: any): IngredientCategoryModel[] {
      return list.map(m => {
        return new IngredientCategoryModel(m.id,m.name);
      })
    }

}