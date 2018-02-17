import { Component, Input, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as $ from 'jquery';

import { StorageService } from '../../shared/storage.service';
import { NotificationsService } from '../../shared/notifications.service';
import { IngredientService } from '../shared/ingredient.service';
import { IngredientModel } from '../shared/ingredient.model';
import { IngredientCategoryModel } from '../shared/ingredient-category.model';

@Component({
  selector: 'ingredient-list',
  template: require('./ingredient-list.html')
})
export class IngredientListComponent implements OnInit {
  ingredients: IngredientModel[] = [];
  categories: IngredientCategoryModel[] = [];

  constructor(
    private _storageService: StorageService,
    private _notificationsService: NotificationsService,
    private _ingredientService: IngredientService) { }

  ngOnInit() {
    Promise.all([
      this._ingredientService.getOtherIngredients(),
      this._ingredientService.getIngredientCategories()    
    ]).then(values => {
      this.ingredients = values[0];
      this.categories = values[1];
    }).catch(_ => this._notificationsService.error('Não foi possível carregar informação'));
  }

  ingredientChange(ingredient: IngredientModel, categoryId: Number) {
    ingredient.categoryId = categoryId;

    this._ingredientService.putIngredient(ingredient.id, ingredient)
      .then(_ => {
        let index = this.ingredients.findIndex(i => i.id == ingredient.id)
        this.ingredients.splice(index, 1);
      })
      .catch(_ => this._notificationsService.error('Ocorreu um erro. Tente novamente mais tarde'));
  }
}