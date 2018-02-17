import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Headers,RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { ShoppingItemModel } from './shopping-item.model';
import { IngredientModel } from './ingredient.model';
import { UnitModel } from '../../recipes/shared/unit.model';
import { HttpManager } from './../../shared/http.manager';


@Injectable()

export class ShoppingItemService {

    private endpoint = "shoppingItems";

    constructor(private _http: HttpManager) {
    }

    /**
     * Gets shopping items of a limit date range, ordered by date.
     * TODO 
     */
    getShoppingItems(from: Date, until: Date): Promise<ShoppingItemModel[]> {
        return this._http.getAll(this.endpoint, new  RequestOptions({
                headers: new Headers({
                    'filter-from': from,
                    'filter-until': until
                })
            }))
            .map(this.listOfShoppingItems)
            .toPromise();
    }

    /**
     * Shopping item put action - bulk!
     * TODO
     */
    bulkPut(items: ShoppingItemModel[]): Promise<any> {
        return this._http.putAll(this.endpoint, items)
            .toPromise();
    }

    /**
     * Shopping item put action
     * TODO
     */
    put(item: ShoppingItemModel): Promise<any> {
        return this._http.put(this.endpoint, item.id, item)
            .toPromise();
    }

    /**
     * Casting method.
     */
    private listOfShoppingItems(list: any): ShoppingItemModel[] {
        return list.map(m => {

           return new ShoppingItemModel(
                m.id,
                m.userId,
                new Date(m.date),
                m.mealTime,
                m.recipeId,
                m.mealServings,
                m.recipeServings,
                m.recipeQuantity,
                m.quantityChecked,
                new UnitModel(
                    m.unit.id,
                    m.unit.name,
                    m.unit.aggregate,
                    m.unit.abbreviation
                ),
                new IngredientModel(
                    m.ingredient.id,
                    m.ingredient.name,
                    m.ingredient.categoryId
                )
            );
        });
    }

}