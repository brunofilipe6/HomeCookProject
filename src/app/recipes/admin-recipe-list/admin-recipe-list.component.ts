import { Component, Input, Output, EventEmitter, ElementRef  } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationsService } from '../../shared/notifications.service';
import { StorageService } from '../../shared/storage.service';

import { RecipeService } from '../shared/recipe.service';
import { RecipeModel } from '../shared/recipe.model';

@Component({
  selector: 'admin-recipe-list',
  template: require('./admin-recipe-list.html')
})

export class AdminRecipeListComponent {

  recipes : RecipeModel[];

  selectedRecipeId = null;

  /** To control HTMLElement */
  modal: HTMLElement;

  skipRecipe: number = 0;
  limitRecipe: number = 15;
  nextRecipe: boolean = false;
  previousRecipe: boolean = false;

  constructor(
    private _router: Router,
    private _storageService: StorageService,
    private _notificationsService : NotificationsService, 
    private _recipeService: RecipeService,
    private _elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.getRecipes();
    // var values: any;
    // values = {skip: this.skipRecipe, limit: this.limitRecipe + 1, isMyRecipes: true };
    // Fetch recipes
    // this._recipeService.getRecipes(values)
    // .then(
    //   recipe_ist => {
    //     this.recipes = recipe_ist;
    //   }
    // )
    // .catch( res => {
    //   // Notify user
    //   this._notificationsService.error('Não foi possível carregar lista de receitas');
    // });
  }

  ngAfterViewInit() {
    this.modal = this._elementRef.nativeElement.children[0];
  }

  getRecipes() {
    var values: any;
    values = {skip: this.skipRecipe, limit: this.limitRecipe + 1, isMyRecipes: true };
    console.log(values);
    this._recipeService.getRecipes(values)
      .then(res => {
        if (res.length === 16) {
          this.nextRecipe = true;
          res.pop();
        }
        else {
          this.nextRecipe = false;
        }
        this.recipes = res;
      })
      .catch(_ => this._notificationsService.error('Não foi possível obter receitas'));

  }

  /**
   * Deletes a recipe
   */
  deleteRecipe(recipe) {

    this._recipeService.delete(recipe)
      .then(
        r => {
          var id = recipe.id;
          this.recipes = this.recipes.filter(function (recipe) {
            return recipe.id !== id;
          });
          this._notificationsService.success('Receita eliminada');
        }
      )
      .catch( res => {
        // Notify user
        this._notificationsService.error('Não foi possível eliminar a receita');
      });
  }

  /**
   * Opens recipe details
   * Sets selectRecipe property and shows modal.
   */
  openRecipeDetail(recipe) {
    this.selectedRecipeId = recipe.id;
    (<any>$(this.modal)).modal('show');
  }

  /**
   * Closes recipe details
   * Unsets selectRecipe property and hides modal.
   */
  closeRecipeDetails() {
    (<any>$(this.modal)).modal('hide');
    this.selectedRecipeId = null;
  }

  get isAdmin() {
    return this._storageService.settings.isAdmin;
  }

  navigateToRecipe(recipeId: Number) {
    this.closeRecipeDetails();
    this._router.navigateByUrl(`recipes/${recipeId}`);
  }

  refreshListRecipes(skipNext: boolean) {
  // Next Recipes
    if (skipNext) {
      this.skipRecipe += this.limitRecipe;
      this.nextRecipe = false;
      this.previousRecipe = true;
    }
    // Previous Recipes
    else {
      this.skipRecipe -= this.limitRecipe;
      if (this.skipRecipe === 0) {
        this.previousRecipe = false;
      }
      this.nextRecipe = true;
    }
    this.recipes = [];
    console.log(this.limitRecipe, this.skipRecipe);
    this.getRecipes();
  }

}
