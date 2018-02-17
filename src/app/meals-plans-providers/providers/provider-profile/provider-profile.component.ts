import { Component, OnInit, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationsService } from '../../../shared/notifications.service';
import { StorageService } from '../../../shared/storage.service';
import { ProviderService } from '../shared/provider.service';
import { RecipeService } from '../../../recipes/shared/recipe.service';
import { PlanService } from '../../plans/shared/plan.service';

import { FullProviderModel } from '../shared/full-provider.model';
import { RecipeModel } from '../../../recipes/shared/recipe.model';
import { PlanModel } from '../../plans/shared/plan.model';
import { PlanBoughtModel } from '../../plans/shared/plans-bought.model';

@Component({
  selector: 'provider-profile',
  template: require('./provider-profile.html')
})
export class ProviderProfileComponent {
  @Output() insertRecipe = new EventEmitter();

  /** Provider Data */
  provider: FullProviderModel;
  providerId: Number;

  /** Recipe Data */
  recipes: RecipeModel[];
  skipRecipes: number = 0;
  limitRecipes: number = 4;
  nextRecipes: boolean = false;
  previousRecipes: boolean = false;

  /** Recipe Detail */
  selectedRecipeId: number = null;
  selectedRecipeServings: number = null;

  /** Plans Data */
  plansAll: PlanModel[];
  plansBought: PlanModel[];
  skipPlans: number = 0;
  limitPlans: number = 5;
  nextPlans: boolean = false;
  previousPlans: boolean = false;

  /** Plans with boolean about bought */
  plans: PlanBoughtModel[] = [];

  /** Modal */
  modal: HTMLElement;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _elementRef: ElementRef,
    private _notificationsService: NotificationsService,
    private _storageService: StorageService,
    private _providerService: ProviderService,
    private _recipeService: RecipeService,
    private _planService: PlanService) { }


  ngOnInit() {
    this.providerId = this._route.params['value']['id'];
    this.getProvider();
    this.getPlansBought();
    this.getRecipesProvider();
  }

  ngAfterViewInit() {
    this.modal = document.getElementById('recipe-modal');
  }

  /**
   * Get Data of Provider
   * 
   * 
   * @memberOf ProviderProfileComponent
   */
  getProvider() {
    this._providerService.getSpecificProvider(this.providerId)
      .then(provider => { this.provider = provider; })
      .catch(error => this._notificationsService.error(error.statusText));
  }

  /**
   * Get plans bought
   * 
   * 
   * @memberOf ProviderProfileComponent
   */
  getPlansBought() {
    this._planService.getBoughtPlans()
      .then(res => {
        this.plansBought = res;
        this.getPlansProvider();
      })
      .catch(_ => this._notificationsService.error('Não foi possível obter os planos comprados ao provedor: ' + this.provider.name))
  }

  /**
   * Catch all plans by provider
   * 
   * 
   * @memberOf ProviderProfileComponent
   */
  getPlansProvider() {
    var values: any;
    values = { providerId: this.providerId, skip: this.skipPlans, limit: this.limitPlans + 1 };
    this._planService.getProviderPlans(values)
      .then(res => {
        if (res.length === 6) {
          this.nextPlans = true;
          res.pop();
        }
        else {
          this.nextPlans = false;
        }
        this.plansAll = res;
        for (var i = 0; i < res.length; i++) {
          this.plans.push(new PlanBoughtModel(res[i], false));
        }
        for (var i = 0; i < this.plansBought.length; i++) {
          let elem = this.plans.find(elem => elem.plan.id === this.plansBought[i].id);
          if (elem) {
            elem.bought = true;
          }
        }
      })
      .catch(_ => this._notificationsService.error('Não foi possível obter os planos do provedor: ' + this.provider.name));
  }

  /**
   * Get Recipes of Provider
   * 
   * 
   * @memberOf ProviderProfileComponent
   */
  getRecipesProvider() {
    var values: any;
    values = { providerId: this.providerId, skip: this.skipRecipes, limit: this.limitRecipes + 1 };
    this._recipeService.getRecipes(values)
      .then(res => {
        if (res.length === 5) {
          this.nextRecipes = true;
          res.pop();
        }
        else {
          this.nextRecipes = false;
        }
        this.recipes = res;
      })
      .catch(_ => this._notificationsService.error('Não foi possível obter receitas do provedor ' + this.provider.name));
  }

  /**
   * return true or false, for print price
   * 
   * @param {PlanModel} plan
   * 
   * @memberOf ProviderProfileComponent
   */
  boughtPlan(planId: number): boolean {
    console.log(planId)
    /**let price = this.plansBought.find(elem => elem.id === 1);
    if(price){
        return true;
    }
    return false; */
    return true;
  }

  /**
   * 
   * 
   * @param {boolean} limitNext
   * 
   * @memberOf ProviderProfileComponent
   */
  refreshListRecipes(skipNext: boolean) {
    // Next Recipes
    if (skipNext) {
      this.skipRecipes += this.limitRecipes;
      this.nextRecipes = false;
      this.previousRecipes = true;
    }
    // Previous Recipes
    else {
      this.skipRecipes -= this.limitRecipes;
      if (this.skipRecipes === 0) {
        this.previousRecipes = false;
      }
    }
    this.getRecipesProvider();
  }

  /**
   * 
   * 
   * @param {boolean} skipNext
   * 
   * @memberOf ProviderProfileComponent
   */
  refreshListPlans(skipNext: boolean) {
    // Next Plans
    if (skipNext) {
      this.skipPlans += this.limitPlans;
      this.nextPlans = false;
      this.previousPlans = true;
    }
    // Previous Plans
    else {
      this.skipPlans -= this.limitPlans;
      if (this.skipPlans === 0) {
        this.previousPlans = false;
      }
    }
    this.plans = [];
    this.getPlansProvider();
  }

  /**
   * On select a recipe, the modal is shown
   * 
   * @param {RecipeModel} recipe
   * 
   * @memberOf RecipeListComponent
   */
  selectRecipe(recipe: RecipeModel) {
    (<any>$(this.modal)).modal('show');
    this.selectedRecipeId = recipe.id;
    this.selectedRecipeServings = recipe.servings;
  }

  /**
   * Hide the modal and reset the parameters
   * 
   * 
   * @memberOf RecipeListComponent
   */
  closeModal() {
    (<any>$(this.modal)).modal('hide');
  }

  get isAdmin() {
    return this._storageService.settings.isAdmin;
  }

  navigateToRecipe(recipeId: Number) {
    this.closeModal();
    this._router.navigateByUrl(`recipes/${recipeId}`);
  }
}