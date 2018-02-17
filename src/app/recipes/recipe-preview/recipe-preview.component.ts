import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';

import { RecipeModel } from '../shared/recipe.model';
import { RecipeService } from '../shared/recipe.service';
import { NotificationsService } from '../../shared/notifications.service';
import { RecipeIngredientLineModel } from '../shared/recipe-ingredient-line.model';

@Component({
  selector: 'recipe-preview',
  template: require('./recipe-preview.html')
})

export class RecipePreviewComponent{
  @Input() recipe: RecipeModel;
  @Input() servings; /** servings element recipe */
  @Input() fromPlanner; /** From planner or recipe-list */
  @Input() addToPlanner; /** add to planner or only see */
  @Input() bought: boolean = true; /** restrite acess to recipe */


  /** Variables output */
  @Output() updateServings = new EventEmitter();
  @Output() recipeToInsert = new EventEmitter();

  /** last value of servings */
  lastValueservings = 0;

  /** Constructor */
  constructor(private _elementRef: ElementRef, private _notificationsService: NotificationsService, private _recipeService: RecipeService) { }


  ngOnInit(){
    this._recipeService.getRecipe(this.recipe.id)
        .then(res => this.recipe.groups = res.groups)
        .catch(_ => this._notificationsService.error("Não foi possível obter os grupos das receitas!"));
  }


  setFavorite(event) {
    event.stopPropagation();
    event.preventDefault();
    this.recipe.isFavorite = !this.recipe.isFavorite;

    this._recipeService.updateFavorite(this.recipe)
      .then(res => {
        
      })
      .catch(err => {
        this.recipe.isFavorite = !this.recipe.isFavorite;
        this._notificationsService.error("Não foi possível atualizar como favorito")
      });
  }

}
