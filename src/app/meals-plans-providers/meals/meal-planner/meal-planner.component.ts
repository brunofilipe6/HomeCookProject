import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import * as moment from 'moment';

import { MealService } from '../shared/meal.service';
import { MealModel } from '../shared/meal.model';
import { RecipeModel } from '../../../recipes/shared/recipe.model';
import { IngredientModel } from '../../../recipes/shared/ingredient.model';
import { RecipeIngredientLineModel } from '../../../recipes/shared/recipe-ingredient-line.model';
import { DayMeals } from '../shared/day-meals.model';
import { FriendlyDatePipe } from '../../../shared/friendly-date.pipe';
import { NotificationsService } from '../../../shared/notifications.service';
import { AuthService } from '../../../users/shared/auth.service';
import { StorageService } from '../../../shared/storage.service';
import { PlanService } from '../../plans/shared/plan.service';
import { PlanModel } from '../../plans/shared/plan.model';

@Component({
  selector: 'meal-planner',
  template: require('./meal-planner.html'),
})

export class MealPlanner {

  /** Scheduled meals inside planner */
  meals_scheduled : DayMeals[]; 
  /** Full meals calendar (including scheduled meals) */
  meal_calendar : DayMeals[];
  plans : PlanModel[];

  loaded: Boolean = false;
  noBoughtPlans: Boolean = false;
  
  locale = 'pt';
  mealTimes = MealModel.getMealTimes(true);
  mealTimesTranslations = MealModel.getMealTimesTranslations(this.locale);

  mealTimeToAddMeal;
  indexToAddMeal;
  adding_meal = false;

  /** Recipe-list filter by typ recipe */
  breakfast: boolean = false;
  lunchdinner: boolean = false;

  /* Recipe id selected to view details */
  viewRecipeId = null;
  /* Servings of selected recipe to view details */
  viewRecipeServings = null;

  /** To control HTMLElement */
  /** Browser modal */
  browserModal: HTMLElement;
  /** Recipe details modal */
  recipeDetailsModal : HTMLElement;

  /** Verify if recipeList modal openned */
  recipeListOpenned: boolean = false;

  constructor(
    private _router: Router, 
    private _elementRef: ElementRef, 
    private _storageService: StorageService,
    private _notificationsService : NotificationsService, 
    private _mealService: MealService, 
    private _planService: PlanService) { }

  ngOnInit() {
    this.getMeals();
    this.getPlans();
}

  ngAfterViewInit() {
    this.browserModal = this._elementRef.nativeElement.children[0];
    this.recipeDetailsModal = this._elementRef.nativeElement.children[1];
  }

  /**
   * Close modals
   * 
   * 
   * @memberOf MealPlanner
   */
  ngOnDestroy(){
    this.closeDetails();
    this.closeBrowser();
  }

  getMeals() {
    var min_start_date = moment().add(-1, 'days').startOf('day').toDate();
    var max_end_date = moment().add(6, 'days').endOf('day').toDate();

    this._mealService.getMeals(min_start_date, max_end_date)
      .then(meals_list => {
        // Transform flat list of meals into grouped structure - list of DayMeals.
        this.meals_scheduled = meals_list.reduce(
          (a, b) => {
            if (typeof a[b.date.getDate()] == "undefined") {
              a[b.date.getDate()]              = new DayMeals(b.date, null, null, null);
              a[b.date.getDate()]['breakfast'] = null;
              a[b.date.getDate()]['lunch']     = null;
              a[b.date.getDate()]['dinner']    = null;
            }
            // (mcapelo, 7/12/2016): use date day as index and lower case the meal time
            a[b.date.getDate()][b.mealTime.toLowerCase()] = b;
            return a;
          }, []);

          // Set meal calendar with empty or already scheduled DayMeals
          this.meal_calendar = [];
          for (var d = new Date(min_start_date); d.getTime() < max_end_date.getTime(); d.setDate(d.getDate()+1)) {
              var date_day = d.getDate();
              if (typeof this.meals_scheduled[date_day] !== "undefined") {
                this.meal_calendar.push(this.meals_scheduled[date_day]);
              } else {
                this.meal_calendar.push(new DayMeals(new Date(d), null, null, null));
              }
          }
          this.loaded = true; 
        }
      )
      .catch(res => this._notificationsService.error('Não foi possível carregar o plano de refeições'));
  }

  /**
   * Get plans facade method
   * Currently used to get only the user's bought plans
   * 
   * 
   * @memberOf MealPlanner
   */
  getPlans() {
    this.noBoughtPlans = false;

    this._planService.getBoughtPlans()
      .then(res => {
        this.plans = res;

        if(!this.plans.length) {
          this.noBoughtPlans = true;
        }
      })
      .catch(_ => this._notificationsService.error('Não foi possível carregar os seus planos'));
  }

  /** Button Add meal */
  addMeal(index, mealTime) {
    this.indexToAddMeal = index;
    this.mealTimeToAddMeal = mealTime;
    if(mealTime === 'breakfast') this.breakfast = true;
    else if (mealTime === 'lunch' || mealTime === 'dinner') this.lunchdinner = true;
    this.openBrowser();
  }

  /**
   * Adds a new meal to the planner with the received recipe model  
   */  
  addRecipeToPlanner(recipe : RecipeModel, servings : Number){

    if (typeof servings == "undefined") {
      servings = this._storageService.settings.servings;
    }

    var new_meal = new MealModel(
      null,
      this.meal_calendar[this.indexToAddMeal].date, 
      this.mealTimeToAddMeal, 
      recipe,
      servings
    );

    this.meal_calendar[this.indexToAddMeal][this.mealTimeToAddMeal] = new_meal;

    this._mealService.save(new_meal)
      .then( result => {
        // After saving, add meal id to saved meal
        this.meal_calendar[this.indexToAddMeal][this.mealTimeToAddMeal].id = result.id;
        this.closeBrowser();
        this._notificationsService.success('Receita adicionada do planeador.');
      })
      .catch( error => {
        // Undo addition of meal
        this.meal_calendar[this.indexToAddMeal][this.mealTimeToAddMeal] = null;
        // Notify user
        this._notificationsService.error('Não foi possível adicionar a refeição ao planeador');
        this.closeBrowser();        
      });

  }

  /**
   * Removes meal from planner 
   */
  removeMeal(index, mealTime) {

    var meal = this.getMeal(index,mealTime);

    if (!meal) {
      this._notificationsService.error('Não foi possível remover a refeição do planeador');
      return ;
    }

    this._mealService.delete(meal)
      .then( result => {
        this.meal_calendar[index][mealTime] = null;
        this._notificationsService.success('Receita removida do planeador.');
      })
      .catch( error => {      
        // Notify user
        this._notificationsService.error('Não foi possível remover a refeição do planeador');
      });
  }

  /**
   * Returns meal from internal structure or false if none is found.
   * 
   */
  getMeal(index, mealTime) {
    return ( typeof this.meal_calendar[index] !== "undefined" && typeof this.meal_calendar[index][mealTime] !== "undefined")? 
      this.meal_calendar[index][mealTime] : false;
  }

  /** Update number of people eat */
  updateServings(value,index, mealTime){

    var meal = this.getMeal(index,mealTime);

    if (!meal) {
      this._notificationsService.error('Não foi possível alterar o número de doses da refeição');
      return ;
    }

    // Store previous servings
    var previous_servings = meal.servings;
    // Update meal servings
    meal.servings = value;

    this._mealService.save(meal)
      .then()
      .catch( error => {   
        // Undo update
        meal.servings = previous_servings;
        // Notify user
        this._notificationsService.error('Não foi possível alterar o número de doses da refeição');
      });
  }

  getPlanTypePT(plan: PlanModel) {
    if(plan.isPlanTypeFull) {
      return 'Completo';
    }
    else if(plan.isPlanTypeBreakfast) {
      return 'Pequeno-almoço';
    }
    else if(plan.isPlanTypeLunch) {
      return 'Almoço';
    }
    else if(plan.isPlanTypeDinner) {
      return 'Jantar';
    }
  }

  addToPlanner(plan: PlanModel) {
    let startDate = moment().format('YYYY-MM-DD');
    
    this._mealService.addPlanToMeals(plan.id, startDate)
      .then(_ => this.getMeals())
      .catch(_=> this._notificationsService.error('Não foi possível adicionar ao plano'));
  }

  navigateToPlans() {
    this._router.navigateByUrl('plans');
  }

  /** JQuery for open and close pop up (browser modal view) */
  openBrowser() {
    this.adding_meal = true;
    this.recipeListOpenned = true;
    (<any>$(this.browserModal)).modal('show');
  }

  closeBrowser() {
    this.adding_meal = null;
    (<any>$(this.browserModal)).modal('hide');
    this.recipeListOpenned = false;
    this.breakfast = false;
    this.lunchdinner = false;
  }

  /** JQuery for open and close pop ups (recipe details modal views) */
  openDetails(meal: MealModel) {
    this.viewRecipeId = meal.recipe.id;
    this.viewRecipeServings = meal.servings;
    (<any>$(this.recipeDetailsModal)).modal('show');
  }

  openRecipeDetail(recipe: RecipeModel){
    this.viewRecipeId = recipe.id;
    this.viewRecipeServings = recipe.servings;
    (<any>$(this.recipeDetailsModal)).modal('show');
  }

  closeDetails() {
    this.viewRecipeId = null;
    (<any>$(this.recipeDetailsModal)).modal('hide');
    if(this.recipeListOpenned){
      this.openBrowser();
    }
  }

   updateStateModalRecipeList(obj: any){
      /** Close Recipe-List */
      this.adding_meal = null;
      (<any>$(this.browserModal)).modal('hide');
      
      /** Come with recipe, open details */
      if(obj.valueState){
        this.openRecipeDetail(obj.recipeSelected);
      }

      /** update state of variable */
      else{
        this.recipeListOpenned = false;
        this.breakfast = false;
        this.lunchdinner = false;
      }
   }

  get isAdmin() {
    return this._storageService.settings.isAdmin;
  }

  navigateToRecipe(recipeId: Number) {
    this.closeBrowser();
    this.closeDetails();
    this._router.navigateByUrl(`recipes/${recipeId}`);
  }
}
