import { Component, Input, Output, EventEmitter, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { PlanService } from '../shared/plan.service';
import { AuthService } from '../../../users/shared/auth.service';
import { StorageService } from '../../../shared/storage.service';
import { NotificationsService } from '../../../shared/notifications.service';
import { ValidationService } from '../../../shared/validation.service';

import { PlanModel } from '../shared/plan.model';
import { PlanMealModel } from '../shared/plan-meal.model';
import { RecipeModel } from '../../../recipes/shared/recipe.model';


@Component({
  selector: 'plan-maker',
  template: require('./plan-maker.html')
})

export class PlanMakerComponent {

  private subscription: Subscription;

  form: FormGroup;
  locale = 'pt';

  /** Plan to edit */
  private plan: PlanModel;
  /** Grouped plan meals: array from  0..plan_days.length index to array with 
   * each meal_times as index and a plan meal model instance or null as its value */
  private planMealsCalendar;
  /** Number of planned meals */
  private nPlannedMeals = 0;
  /** Number of meals in plan */
  private nMealsInPlan = 0;


  /* Components interaction: Recipe id selected to view details */
  viewRecipeId = null;
  /* Components interaction: Index (day-1) selected to add plan meal */
  indexToAddMeal = null
  /* Components interaction: Meal time selected to add plan meal */
  mealTimeToAddMeal = null;
  /* Components interaction: True if currently adding meal */
  addingMeal = false;
  /** Components interaction: Recipe details modal to control HTMLElement */
  recipeDetailsModal : HTMLElement;
  /** Components interaction: Browser modal to control HTMLElement */
  browserModal: HTMLElement;

  /* Static value - Range of days in plan */
  planDays = [1,2,3,4,5,6,7];
  /* Static value - Possible plan types */
  planTypes = PlanModel.getPlanTypes();
  /* Static value - Possible meal times */
  mealTimes = PlanMealModel.getMealTimes(false); 
  /* Static value - Translations of possible meal times */
  mealTimesTranslations = PlanMealModel.getMealTimesTranslations(this.locale);

  loaded = false;

  constructor(
    private _router: Router,
    private activatedRoute: ActivatedRoute, 
    private _authService: AuthService, 
    private _planService : PlanService, 
    private _formBuilder: FormBuilder,
    private _notificationsService: NotificationsService,
    private _elementRef: ElementRef,
    private _storageService: StorageService ) {}

  ngOnInit() {
    
    // subscribe to router event
    this.subscription = this.activatedRoute.params.subscribe(
      (param: any) => {
        let id = param['id'];

        if (id == "new") {
          this.plan = new PlanModel(
            0,
            '',
            '',
            0,
            0,
            '',
            null,
            false
          );

          this.setPlanMealCalendar([])
          this.initForm();
          this.loaded = true;

        } else {

          // After both promises are finished 
          Promise.all([
              this._planService.getPlan(id),
              this._planService.getPlanMeals(id)
          ]).then(values => {
              this.plan = values[0];
              var plan_meals = values[1];
              this.nMealsInPlan = (this.plan.planType == 'Full') ? 21:7; 
              this.setPlanMealCalendar(plan_meals);
              this.setNPlannedMeals();
              this.initForm();
              this.loaded = true;
          }).catch(error => {
              this._notificationsService.error("Não foi possível carregar o plano");
          })
          
          ;
        }
      });
    
  }

  ngAfterViewInit() {
    this.browserModal = this._elementRef.nativeElement.children[0];
    this.recipeDetailsModal = this._elementRef.nativeElement.children[0];

    var e = $('.plan-data');
    // TODO not right
    if($('.main-content').height() <= e.height()) {
      e.removeClass("affix");
      e.removeClass("col-xs-12");
    }

    window.onresize = function(event) {
      var e = $('.plan-data');
      var b = $('.main-content');
      if(b.height() <= e.height()) {
        e.removeClass("affix");
        e.removeClass("col-xs-12");
      } else {
        e.addClass("affix");
        e.addClass("col-xs-12");
        
      }
    }
  }


  /**
   * Initializes the form controls
   */
  initForm() {

    this.form = this._formBuilder.group({
      title: new FormControl(this.plan.title, [
        Validators.required,
        Validators.minLength(3)
      ]),
      description: new FormControl(this.plan.description, [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(500),
      ]),
      planType: new FormControl(this.plan.planType, [
        Validators.required
      ])
    });

    this.form.valueChanges
      .debounceTime(300)
      .subscribe(values => {
        if (this.plan.id && this.form.touched) {
          this.savePlan();
        }
      });
  }

  /**
   * Action of form submition
   */
  savePlan() {
    if(!this.form.valid) {
      ValidationService.markControlsAsTouched(this.form);
      return;
    }

    this._planService.save(this.plan)
      .then(res => {
        this.plan.id = res.id;      
        this.nMealsInPlan = (this.plan.planType == 'Full') ? 21:7;   
        this.setNPlannedMeals();
        this._notificationsService.success("Plano gravado")
      })
      .catch(error => {
        this._notificationsService.error("Não foi possível gravar o plano");
        this._planService.getPlan(this.plan.id)
          .then(res => { this.plan = res; })
          .catch(error => {  });
        
      });
  }

  /**
   * Takes a flat list of plan meal model instances and updates the planMealsCalendar property.
   */
  setPlanMealCalendar (plan_meals: PlanMealModel[]) {

    // Set plan meal calendar with existing plan meals grouped by day
    this.planMealsCalendar = [];
    var day_meals;
    for (var i in this.planDays) {

        var d = this.planDays[i];
        day_meals = {};
        for (var j in this.mealTimes) {
          day_meals[this.mealTimes[j]] = null;
        }

        for (var n_meals = 0; n_meals < plan_meals.length ; n_meals++) {
          var pm = <PlanMealModel> plan_meals[n_meals];
          if (pm.day === d) {
            // If meal found for the nth (current) day d, 
            // add it to day meals and remove from plan_meals set
            day_meals[pm.mealTime] = pm;
          }
        }
      this.planMealsCalendar[i] = day_meals;
    }
  }

  /**
   * Takes a flat list of plan meal model instances and updates the planMealsCalendar property.
   */
  setNPlannedMeals () {
    var n = 0;
    for (var i in this.planMealsCalendar) {
      var pm = this.planMealsCalendar[i];
      for (var j in this.mealTimes) {
        var mealTime = this.mealTimes[j];
        if (pm[mealTime] && (this.plan.planType=="Full" || this.plan.planType == mealTime)) {
          n++;
        }
      }
    }
    this.nPlannedMeals = n;
  }

  /**
   * Button Add meal
   * Saves index of meal to be added to plan and its time, and opens browser.
   */
  addMeal(index, mealTime) {
    this.indexToAddMeal = index;
    this.mealTimeToAddMeal = mealTime;
    this.openBrowser();
  }

  /**
   * Adds a new recipe to the plan into the day and meal time stored
   */  
  addRecipeToPlan(recipe : RecipeModel){

    var new_meal = new PlanMealModel(
      null,
      this.plan.id, 
      this.indexToAddMeal+1,
      this.mealTimeToAddMeal, 
      recipe
    );

    this.planMealsCalendar[this.indexToAddMeal][this.mealTimeToAddMeal] = new_meal;

    this._planService.saveMeal(new_meal)
      .then( result => {
        this.setNPlannedMeals();
        // After saving, add plan meal id to saved meal
        this.planMealsCalendar[this.indexToAddMeal][this.mealTimeToAddMeal].id = result.id;
        this._notificationsService.success('Refeição adicionada ao plano');
        this.closeBrowser();
      })
      .catch( error => { 
        // Undo addition of meal
        this.planMealsCalendar[this.indexToAddMeal][this.mealTimeToAddMeal] = null;
        // Notify user
        this._notificationsService.error('Não foi possível adicionar a refeição ao plano');
        this.closeBrowser();        
      });

  }

  /**
   * Removes meal from plan 
   */
  removeMeal(index, mealTime) {

    var meal = this.planMealsCalendar[index][mealTime]

    if (!meal) {
      this._notificationsService.error('Não foi possível remover a refeição do plano');
      return ;
    }

    this._planService.deleteMeal(meal)
      .then( result => {
        this.planMealsCalendar[index][mealTime] = null;
        this.setNPlannedMeals();
        this._notificationsService.success('Refeição removida do plano');
      })
      .catch( error => {
        // Notify user
        this._notificationsService.error('Não foi possível remover a refeição do planeador');
      });
  }

  /** JQuery for open and close pop ups (recipe details modal views) */
  openDetails(recipe: RecipeModel) {
    this.viewRecipeId = recipe.id;
    $(this.recipeDetailsModal).show();
  }

  closeDetails() {
    this.viewRecipeId = null;
    $(this.recipeDetailsModal).hide();
  }
  
  /** JQuery for open and close pop up (browser modal view) */
  openBrowser() {
    this.addingMeal = true;
    $(this.browserModal).show();
  }

  closeBrowser() {
    $(this.browserModal).hide();
    this.addingMeal = false;
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