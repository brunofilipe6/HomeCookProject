import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { StorageService } from '../../../shared/storage.service';
import { NotificationsService } from '../../../shared/notifications.service';
import { PlanService } from '../shared/plan.service';
import { PlanModel } from '../shared/plan.model';
import { PlanMealModel } from '../shared/plan-meal.model';
import { RecipeModel } from '../../../recipes/shared/recipe.model'
import { ProviderModel } from '../../providers/shared/provider.model';

@Component({
  selector: 'plan-detail',
  template: require('./plan-detail.html')
})
export class PlanDetailComponent implements OnInit, AfterViewInit {
  plan: PlanModel = null;
  meals: PlanMealModel[] = [];
  mealTimes: String[] = PlanMealModel.getMealTimes(true);
  
  selectedRecipeId = null;
  
  modal: HTMLElement;

  constructor(
    private _router: Router,
    private _elementRef: ElementRef,
    private _activatedRoute: ActivatedRoute,
    private _storageService: StorageService,
    private _notificationsService: NotificationsService,
    private _planService: PlanService) { }

  ngOnInit() {
    let planId = this._activatedRoute.params['value'].id;

    Promise.all([
      this._planService.getPlan(planId),
      this._planService.getPlanMeals(planId)
    ]).then(values => {
      this.plan = values[0];
      this.meals = values[1];
    }).catch(error => this._notificationsService.error('Não foi possível carregar a informação'));
    
  }

  ngAfterViewInit() {
    this.modal = this._elementRef.nativeElement.getElementsByClassName('modal')[0];
  }

  ngOnDestroy(){
    this.closeModal();
  }

  /**
   * The plan price depends on the user's role
   * plan
   * @returns
   * 
   * @memberOf PlanDetailComponent
   */
  getPlanPrice() {
    return this.plan.getPrice(this._storageService.settings.isFree);
  }

  getPlanPriceToLocaleString() {
    return this.plan.getPriceToLocaleString(this._storageService.settings.isFree);
  }

  /**
   * Current method to display the plan' image
   * 
   * @returns
   * 
   * @memberOf PlanDetailComponent
   */
  getPlanImage() {
    return this.meals[0] && this.meals[0].recipe.image || null;
  }

  get isBreakfastPlan() {
    return this.plan && (this.plan.isPlanTypeBreakfast || this.plan.isPlanTypeFull);
  }

  get isLunchPlan() {
    return this.plan && (this.plan.isPlanTypeLunch || this.plan.isPlanTypeFull);
  }

  get isDinnerPlan() {
    return this.plan && (this.plan.isPlanTypeDinner || this.plan.isPlanTypeFull);
  }

  /**
   * On select a recipe, the modal is shown
   * 
   * @param {RecipeModel} recipe
   * 
   * @memberOf RecipeListComponent
   */
  selectRecipe(recipe: RecipeModel) {
    if(this.plan.bought){
      (<any>$(this.modal)).modal('show');
      this.selectedRecipeId = recipe.id;
    }
    else{
      this._navigateToTarget();
    }
  }

  /**
   * Hide the modal and reset the parameters
   * 
   * 
   * @memberOf RecipeListComponent
   */
  closeModal() {
    (<any>$(this.modal)).modal('hide');
    this.selectedRecipeId = null;
  }

  get isAdmin() {
    return this._storageService.settings.isAdmin;
  }

  navigateToRecipe(recipeId: Number) {
    this.closeModal();
    this._router.navigateByUrl(`recipes/${recipeId}`);
  }

  private _navigateToTarget() {
    $('html, body').animate({
      scrollTop: $(document).height()
    }, 1000);
  }


  updateStateFavorite(recipeId: number,stateFavorite: boolean){
    let elem = this.meals.find(meal => meal.recipe.id === recipeId);
    if(elem){
      elem.recipe.isFavorite = stateFavorite;
    }
  }

}