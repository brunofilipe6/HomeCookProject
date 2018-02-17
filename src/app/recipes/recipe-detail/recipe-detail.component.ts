import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { MetaService } from 'ng2-meta';

import { RecipeService } from '../shared/recipe.service';
import { RecipeModel } from '../shared/recipe.model';
import { NotificationsService } from '../../shared/notifications.service';
import { RecipeIngredientLineModel } from '../shared/recipe-ingredient-line.model';
import { IngredientModel } from '../shared/ingredient.model';
import { UnitModel } from '../shared/unit.model';
import { ProviderService } from '../../meals-plans-providers/providers/shared/provider.service';
import { FullProviderModel } from '../../meals-plans-providers/providers/shared/full-provider.model';


@Component({
  selector: 'recipe-detail',
  template: require('./recipe-detail.html')
})
export class RecipeDetailComponent {

  /** Varibales inputs **/
  @Input() servings = null; /** servings (DOSES)**/
  @Input() addToPlanner; /** put button or not in modal view */
  @Input() mealTime = '';
  @Input() recipeId: Number;
  @Input() freeRecipe: Boolean = true;

  /** Variables outputs */
  @Output() insertRecipe = new EventEmitter();
  @Output() updateFavorite = new EventEmitter();
  @Output() closeModal = new EventEmitter();

  recipe: RecipeModel;
  ingredients: RecipeIngredientLineModel[] = [];
  provider: FullProviderModel = null;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _metaService: MetaService,
    private _recipeService: RecipeService,
    private _providerService: ProviderService,
    private _notificationsService: NotificationsService,
  ) { }

  ngOnInit() {
    if (!this.recipeId) {
      this.recipeId = this._activatedRoute.params['value'].id;
    }

    var obj = this;
    $(window).bind('keydown', function (event) {
      if (event.keyCode == 27) {
        obj.hideModal();
      }
    })

    // Get recipe
    this._recipeService.getRecipe(this.recipeId)
      .then(res => {
        this.recipe = res;
        this.setMetaTagInfo();

        if (!this.servings) {
          this.servings = this.recipe.servings;
        }
        this.getIngredients();
        this.getProvider();
      })
      .catch(error => this._notificationsService.error("Não foi possível carregar a receita"));
  }

  setMetaTagInfo() {
    this._metaService.setTitle(`Homecook - ${this.recipe.name}`);
    this._metaService.setTag('og:title', this.recipe.name);
    this._metaService.setTag('og:url', `http://homecook.pt/#${this._router.url}`);
    this._metaService.setTag('og:description', this.recipe.showDescription);
    this._metaService.setTag('og:image', this.recipe.image);
  }

  /** Function to close poptup */
  hideModal() {
    this.closeModal.emit();
  }

  /** insert recipe in planner */
  insert() {
    this.insertRecipe.emit(this.recipe);
    this.hideModal();
  }

  /** Get ingredients for this recipe */
  getIngredients() {
    this._recipeService.getIngredients(this.recipe.id).then(res => this.ingredients = res.map(ingredient => {
      var ratio = this.servings / this.recipe.servings;

      return new RecipeIngredientLineModel(
        ingredient.id,
        ingredient.quantity * ratio,
        new UnitModel(
          ingredient.unit.id,
          ingredient.unit.name,
          ingredient.unit.aggregate,
          ingredient.unit.abbreviation
        ),
        new IngredientModel(
          ingredient.ingredient.id,
          ingredient.ingredient.name
        ),
        ingredient.recipeId);
    })).catch(_ => this._notificationsService.error('Não foi possivel carregar os ingredientes desta receita'));

  }

  /** Get ingredients for this recipe */
  getProvider() {
    if (!this.recipe.userId) {
      return;
    }

    this._providerService.getSpecificProvider(this.recipe.userId)
      .then(res => this.provider = res)
      .catch(_ => { });
  }

  setFavorite(event) {
    event.stopPropagation();
    event.preventDefault();
    this.recipe.isFavorite = !this.recipe.isFavorite;

    this._recipeService.updateFavorite(this.recipe)
      .then(res => {
          this.updateFavorite.emit({ state: this.recipe.isFavorite });
      })
      .catch(err => {
        this.recipe.isFavorite = !this.recipe.isFavorite;
        this._notificationsService.error("Não foi possível atualizar como favorito")
      });
  }

  /**
   * Redirect page to provider
   * 
   * @param {number} providerId
   * 
   * @memberOf RecipeDetailComponent
   */
  redirect(providerId: number) {
    this.closeModal.emit({ closeModal: true });
    this._router.navigateByUrl("/providers/" + providerId);
  }
}
