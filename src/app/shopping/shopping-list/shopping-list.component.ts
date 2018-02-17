import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import * as moment from 'moment';

import { CalculateQuantityPipe } from './../shared/calculate-quantity.pipe';
import { AbbreviateUnitPipe } from './abbreviate-unit.pipe';
import { NotificationsService } from '../../shared/notifications.service';

import { IngredientCategoryService } from './../shared/ingredient-category.service';
import { IngredientCategoryModel } from './../shared/ingredient-category.model';
import { ShoppingItemService } from './../shared/shopping-item.service';
import { ShoppingItemModel } from './../shared/shopping-item.model';
import { UnitModel } from '../../recipes/shared/unit.model';

@Component({
  selector: 'shopping-list',
  template: require('./shopping-list.html')
})

export class ShoppingListComponent implements OnInit, AfterViewInit {
  categories: IngredientCategoryModel[];
  categoriesToDisplay: IngredientCategoryModel[];
  shoppingItems: ShoppingItemModel[];
  items: any = [];
  items_loaded: Boolean = false;

  min: number = 0;
  max: number = 7;
  offset: number = 5;
  step: number = 1;

  constructor(
    private _ngZone: NgZone,
    private _router: Router,
    private _notificationsService: NotificationsService,
    private _catService: IngredientCategoryService,
    private _itemService: ShoppingItemService,
  ) { }

  ngOnInit() {
    Promise.all([
      this._catService.getIngredientCategories(),
      this.refreshShoppingItems()
    ]).then(values => {
      this.items_loaded = true;
      this.categories = values[0];
      this.shoppingItems = values[1];
      this.updateProperties();
    });
  }

  ngAfterViewInit() {
    let slider = <any>$('.slider');

    slider.slider({
      range: 'min',
      value: this.offset,
      min: this.min,
      max: this.max,
      step: this.step,
      slide: (event, ui) => {
        this.offset = ui.value;
        var new_text = this._getOffsetDate().format('D/M');
        ui.handle.textContent = new_text;
      },
      stop: (event, ui) => {
        this.items_loaded = false;

        // Refresh the shopping items
        this.refreshShoppingItems().then(res => {
          this.items_loaded = true;
          this.shoppingItems = res;

          this._ngZone.run(() => {
            this.updateProperties();
          });
        });
      }
    });

    let handler = slider.children('.ui-slider-handle');
    var new_text = this._getOffsetDate().format('D/M');
    handler.text(new_text);
  }

  _getOffsetDate(): moment.Moment {
    return moment().add(this.offset, 'days');
  }

  updateProperties() {
    // Set groupedItems with the shopping items received grouped by 
    // ingredient on a 'calendar' property and with its own ingredient property
    var groupedItems = this.groupByAndTransform(
      this.shoppingItems,
      // group by
      function (item) {
        return item.ingredient.id;
      },
      // sent group items to new calendar property
      "calendar",
      // create ingredient and quantities properties in group level
      {
        'ingredient': function (group) {
          return group[0].ingredient;
        }
      }
    );

    // Set items with the groupedItems grouped by category id
    this.items = this.groupByAndTransform(
      groupedItems,
      function (item) {
        return item.ingredient.categoryId;
      },
      false,
      false
    );

    this.categoriesToDisplay = this.categories.filter(category => this.items[category.id]);
  }

  /**
   * Group by and transform received array of data.
   * 
   * Groups items by callback parameter f.
   * If group index argument is received, the items of a group will be placed inside a property with its name.
   * If new index properties argument is received, the new properties received will be added to each group index.
   * 
   * @param array data
   * @param Function f Callback function to set group by criteria
   * @param string group_index Index to place grouped items inside each group
   * @param array new_index_properties Array from property index to function to get the property value
   */
  groupByAndTransform(data, f, group_index, new_index_properties) {
    var groups = {};
    var group;

    for (var i in data) {
      var o = data[i];
      group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    }

    // We want to keep the group index and add behavior
    var result = {};
    for (var i in groups) {
      var r = {};
      group = groups[i];
      if (new_index_properties) {
        for (var j in new_index_properties) {
          var o = new_index_properties[j];
          r[j] = o(group);
        }
      }

      // if group_index, place items inside it
      if (group_index) {
        r[group_index] = group;
      } else {
        r = group;
      }

      result[i] = r;
    }

    return result;
  }

  refreshShoppingItems(): Promise<ShoppingItemModel[]> {
    let from = moment().add(this.min, 'days').toDate();
    let until = this._getOffsetDate().endOf('day').toDate();

    return this._itemService.getShoppingItems(from, until);
  }

  /**
   * Returns true if all received items are checked, false otherwise.
   * 
   * @returns boolean
   */
  areShoppingItemsChecked(items: ShoppingItemModel[]): boolean {
    return items
      .map((usage) => usage.quantityChecked == (this.getQuantity(usage)))
      .reduce(
      (c1, c2) => c1 && c2
      );
  }

  getQuantity(item) {
    return new CalculateQuantityPipe().transform(item, []);;
  }

  /**
   * Sets checked property of received shopping items with checking value.
   * If checking items, only change items with full quantity not checked. If unchecking, only change items with
   * full quantity checked.
   * Use bulkPut method on items service. 
   * 
   */
  setCheckedShoppingItems(e, items: ShoppingItemModel[], checking) {

    // Update locally first
    // Store updated item to undo changes in error case
    var updated = [];
    var item;
    for (var i = 0; i < items.length; i++) {
      item = <ShoppingItemModel>items[i];

      var quantity = this.getQuantity(item);
      var checked = quantity == item.quantityChecked;

      // If checking, change only not fully checked items 
      // If unchecking, change only fully checked items
      if ((checking && !checked) || (!checking && checked)) {

        // If checking, next quantity is full quantity, otherwise is 0
        var next_quantity = (!checking) ? 0 : quantity;

        updated[item.id] = item.quantityChecked;

        items[i].quantityChecked = next_quantity;
      }
    }

    this._itemService.bulkPut(items)
      .then(ok => {
        // success
      })
      .catch(nok => {
        // error
        // - undo changes
        for (var i = 0; i < items.length; i++) {
          item = items[i];
          if (typeof updated[item.id] !== "undefined") {
            items[i].quantityChecked = updated[item.id];
          }
        }

        // Notify user
        this._notificationsService.error('Não foi possível actualizar a lista de compas');
      });
  }

  /**
   * Sets or unsets checked received quantity on shopping item. 
   * Allows static toogle - through value of received checking argument.
   *  
   */
  setCheckedShoppingItem(item: ShoppingItemModel, quant: number, checking: boolean) {
    if (item) {

      // Store previously checked quantity to undo changes in error case
      var previous_quantity = item.quantityChecked;

      // Calculate next checked quantity
      var next_quantity;
      if (checking) {
        next_quantity = previous_quantity + quant;
      } else {
        next_quantity = previous_quantity - quant;
      }

      // Update locally first
      item.quantityChecked = next_quantity;

      this._itemService.put(item)
        .then(ok => {
          // success
        })
        .catch(nok => {
          // error 
          // - undo change, use previously checked quantity stored
          item.quantityChecked = previous_quantity;

          // Notify user
          this._notificationsService.error('Não foi possível actualizar a lista de compas');
        });
    }
  }

  /**
   * If don't exist ingredients in shopping-list
   * 
   * 
   * @memberOf ShoppingListComponent
   */
  redirect() {
    this._router.navigateByUrl("/home");
  }
}