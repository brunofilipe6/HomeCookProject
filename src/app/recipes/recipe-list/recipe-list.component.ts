import { Component, Input, Output, EventEmitter, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as $ from 'jquery';

import { StorageService } from '../../shared/storage.service';
import { NotificationsService } from '../../shared/notifications.service';
import { RecipeService } from '../shared/recipe.service';
import { RecipeModel } from '../shared/recipe.model';
import { GroupModel } from '../../shared/checkbox-group/group.model';

@Component({
  selector: 'recipe-list',
  template: require('./recipe-list.html')
})
export class RecipeListComponent implements OnInit, AfterViewInit {
  @Input() fromPlanner = false;
  @Input() addToPlanner = false;
  @Input() showFilters = true;
  @Input() mealTime = '';

  /** Come planner */  
  @Input() breakfast: boolean = false;
  @Input() lunchdinner: boolean = false;

  @Output() insertRecipe = new EventEmitter();
  @Output() closeRecipeList = new EventEmitter();

  recipes: RecipeModel[] = [];
  suggestions: RecipeModel[] = [];
  noSuggestions: Boolean = false;
  searchForm: FormGroup;

  selectedRecipeId = null;
  modal: HTMLElement;
  skip: number = 0;
  limit: number = 12;
  noMoreRecipesToShow: Boolean = false;
  
  /** Group List */
  groupList: GroupModel[] = [];

  constructor(
    private _router: Router,
    private _elementRef: ElementRef,
    private _formBuilder: FormBuilder,
    private _storageService: StorageService,
    private _recipeService: RecipeService,
    private _notificationsService: NotificationsService) { }

  ngOnInit() {
    this.selectedRecipeId = null;
    // Inits the form
    this.searchForm = this._formBuilder.group({
      search: new FormControl(''),
      isMyRecipes: new FormControl(this.isStakeholder),
      isNovelty: new FormControl(false),
      isFavorite: new FormControl(false),
      groups: new FormControl([]),
      vegan: new FormControl(true),
      meat: new FormControl(true),
      fish: new FormControl(true),
      breakfastOrOther: new FormControl(''),
      isBreakfast: new FormControl(false),
      isLunchOrDinner: new FormControl(false),
      rating: new FormControl(''),
      price: new FormControl(''),
      time: new FormControl(''),
      sort: new FormControl('')
    });

    if(this.lunchdinner){
      this.searchForm.controls['breakfastOrOther'].setValue("0");
      this.searchForm.controls['isLunchOrDinner'].setValue(true);
    }
    else if(this.breakfast){
      this.searchForm.controls['breakfastOrOther'].setValue("1");
      this.searchForm.controls['isBreakfast'].setValue(true);
    }

    var obj = this;
    $(window).bind('keydown',function(event) {
      if (event.keyCode == 27) {
          obj.closeModal();
      }
    })

    this._recipeService.getGroups()
      .then(res => { 
        this.groupList = res;
        var elementObj = this; 
        res.map(function(elem){
          var groupState: any = { groupId: elem.groupId, addState: true };
          elementObj.groupsSelected(groupState);
        })
      })
      .catch(_ => this._notificationsService.error('Não foi possível obter as categorias das receitas'));

    this.refreshRecipes(this.searchForm.value);
    this.loadSuggestions();

    // Waits for form changes
    this.searchForm.valueChanges
      .debounceTime(200)
      .subscribe(values => this.refreshRecipes(values));

  }

  ngAfterViewInit() {
    this.modal = document.getElementById('recipe-modal');
  }

  ngOnDestroy(){
    this.closeModal();
  }

  /**
   * Checks whether the user is a stakeholder
   * 
   * @readonly
   * 
   * @memberOf RecipeListComponent
   */
  get isStakeholder() {
    return this._storageService.settings.isStakeholder;
  }

  /**
   * Checks whether the user can add a new recipe
   * 
   * @readonly
   * 
   * @memberOf RecipeListComponent
   */
  get canAddRecipe() {
    return this._storageService.settings.isAdmin || this._storageService.settings.isStakeholder;
  }

  /**
   * Get recipes facade method
   * This method restarts the recipe list
   * 
   * @param {*} [values]
   * 
   * @memberOf RecipeListComponent
   */
  refreshRecipes(values: any) {
    this.skip = 0;
    values.skip = this.skip;
    values.limit = this.limit;

    values = this.updateFormValues(values);

    this._recipeService.getRecipes(values)
      .then(res => {
        this.recipes = res;
        this.updateNoMoreRecipesToShow();
      })
      .catch(_ => this._notificationsService.error('Não foi possível obter receitas'));
  }

  createRecipe() {
    this._router.navigateByUrl("manage-content/manage-recipe/new");
  }

  /**
   * Load more recipes facade method
   * This method appends the retrieved recipes to the recipe list
   * 
   * @memberOf RecipeListComponent
   */
  loadMoreRecipes() {
    this.skip += this.limit;
    let values = this.searchForm.value;
    values.skip = this.skip;
    values.limit = this.limit;

    values = this.updateFormValues(values);

    this._recipeService.getRecipes(values)
      .then(res => {
        this.recipes.push(...res);
        this.updateNoMoreRecipesToShow();

        if (!res.length) {
          this._notificationsService.info('Não foi possível obter mais receitas')
        }
      })
      .catch(_ => this._notificationsService.error('Não foi possível obter receitas'));
  }

  updateFormValues(values) {
    values.rating = false;
    values.price = false;
    values.time = false;

    if(values.sort == "rating") {
      values.rating = "desc";
    }
    else if(values.sort == "price") {
      values.price = "desc";
    }
    else if(values.sort == "time") {
      values.time = "desc";
    }

    return values;
  }

  updateNoMoreRecipesToShow() {
    this.noMoreRecipesToShow = (this.recipes.length == 0);
  }

  /**
   * Suggestions loaded are currently but a mock
   * 
   * 
   * @memberOf RecipeListComponent
   */
  loadSuggestions() {
    this._recipeService.getSuggestions().then(res => {
      this.suggestions = res;
      if(!this.suggestions.length) {
        this.noSuggestions = true;
      }
    }).catch(res => {
      this._notificationsService.error('Não foi possível carregar as sugestões');
    });
  }

  /**
   * Get isMyRecipesPressed
   * Done with a facade method and not with a formControlName because it's not possible to bind a form to a button
   * 
   * @memberOf RecipeListComponent
   */
  get isMyRecipesPressed() {
    return this.searchForm.controls['isMyRecipes'].value;
  }

  /**
   * Set isMyRecipesPressed
   * Done with a facade method and not with a formControlName because it's not possible to bind a form to a button
   * 
   * @memberOf RecipeListComponent
   */
  set isMyRecipesPressed(value) {
    this.searchForm.controls['isMyRecipes'].setValue(value);
  }

  /**
   * Get isNoveltyPressed
   * Done with a facade method and not with a formControlName because it's not possible to bind a form to a button
   * 
   * @memberOf RecipeListComponent
   */
  get isNoveltyPressed() {
    return this.searchForm.controls['isNovelty'].value;
  }


  /**
   * Set isNoveltyPressed
   * Done with a facade method and not with a formControlName because it's not possible to bind a form to a button
   * 
   * @memberOf RecipeListComponent
   */
  set isNoveltyPressed(value) {
    this.searchForm.controls['isNovelty'].setValue(value);
  }

  /**
   * Get isFavoritePressed
   * Done with a facade method and not with a formControlName because it's not possible to bind a form to a button
   * 
   * @memberOf RecipeListComponent
   */
  get isFavoritePressed() {
    return this.searchForm.controls['isFavorite'].value;
  }

  /**
   * Set isFavoritePressed
   * Done with a facade method and not with a formControlName because it's not possible to bind a form to a button
   * 
   * @memberOf RecipeListComponent
   */
  set isFavoritePressed(value) {
    this.searchForm.controls['isFavorite'].setValue(value);
  }

  /**
   * Function for update group list with ""filters""
   * 
   * 
   * @memberOf RecipeListComponent
   */
   private groupsSelected(groupState: any) {
      var valueToInsert: number[] = this.searchForm.controls['groups'].value;

      // add substring number, to string
      if(groupState.addState){
        valueToInsert.push(groupState.groupId);
      }
      // remove substring number, in string
      else{
         valueToInsert = valueToInsert.filter(function(num){
           return groupState.groupId !== num
         });
      }

      // update string groups
      this.searchForm.controls['groups'].setValue(valueToInsert);
  }

  /**
   * Get value vegan selected
   * 
   * 
   * @memberOf RecipeListComponent
   */
  get veganSelect() {
    return this.searchForm.controls['vegan'].value;
  }

  /**
   * update value vegan
   * 
   * 
   * @memberOf RecipeListComponent
   */
  set veganSelect(value) {
    this.searchForm.controls['vegan'].setValue(value);
    let elem = this.groupList.find(elem => elem.groupName === 'Vegetariana')
    if(elem){
      var groupState: any = { groupId: elem.groupId, addState: value };
      this.groupsSelected(groupState);
    }
  }

  /**
   *  get vlaue meat Selected
   * 
   * 
   * @memberOf RecipeListComponent
   */
  get meatSelect() {
    return this.searchForm.controls['meat'].value;
  }

  /**
   * update value meat
   * 
   * 
   * @memberOf RecipeListComponent
   */
  set meatSelect(value) {
    this.searchForm.controls['meat'].setValue(value);
    let elem = this.groupList.find(elem => elem.groupName === 'Carne')
    if(elem){
      var groupState: any = { groupId: elem.groupId, addState: value };
      this.groupsSelected(groupState);
    }
  }

  /**
   * Get value fish selected
   * 
   * 
   * @memberOf RecipeListComponent
   */
  get fishSelect() {
    return this.searchForm.controls['fish'].value;
  }

  /**
   *  update value
   * 
   * 
   * @memberOf RecipeListComponent
   */
  set fishSelect(value) {
    this.searchForm.controls['fish'].setValue(value);
    let elem = this.groupList.find(elem => elem.groupName === 'Peixe')
    if(elem){
      var groupState: any = { groupId: elem.groupId, addState: value };
      this.groupsSelected(groupState);
    }
  }

  /**
   * Get Value isBreakfastSelected
   * 
   * @memberOf RecipeListComponent
   */
  get isBreakfastSelected() {
    return this.searchForm.controls['isBreakfast'].value;
  }

  /**
   * update value when people click in button
   * 
   * 
   * @memberOf RecipeListComponent
   */
  set isBreakfastSelected(value) {
    this.searchForm.controls['isBreakfast'].setValue(value);
    if(value === true){
      this.searchForm.controls['isLunchOrDinner'].setValue(false);
      // update var breakfastOrOther
      this.searchForm.controls['breakfastOrOther'].setValue("1");
    }
    else{
      this.searchForm.controls['breakfastOrOther'].setValue("");
    }
  }

  /**
   * Get value isLunchOrDinnerSelected
   * 
   * 
   * @memberOf RecipeListComponent
   */
  get isLunchOrDinnerSelected() {
    return this.searchForm.controls['isLunchOrDinner'].value;
  }

  /**
   *  update value when people click in button
   * 
   * 
   * @memberOf RecipeListComponent
   */
  set isLunchOrDinnerSelected(value) {
    this.searchForm.controls['isLunchOrDinner'].setValue(value);
    if(value === true){
      this.searchForm.controls['isBreakfast'].setValue(false);
      // update var breakfastOrOther
      this.searchForm.controls['breakfastOrOther'].setValue("0");
    }
    else{
      this.searchForm.controls['breakfastOrOther'].setValue("");
    }
  }


  /**
   * Get rating
   * Done with a facade method and not with a formControlName because it's not possible to bind a form to a button
   * 
   * @memberOf RecipeListComponent
   */
  get rating() {
    return this.searchForm.controls['rating'].value;
  }

  /**
   * Set rating
   * Done with a facade method and not with a formControlName because it's not possible to bind a form to a button
   * 
   * @memberOf RecipeListComponent
   */
  set rating(value) {
    this.searchForm.controls['rating'].setValue(value);
  }

  /**
   * Get price
   * Done with a facade method and not with a formControlName because it's not possible to bind a form to a button
   * 
   * @memberOf RecipeListComponent
   */
  get price() {
    return this.searchForm.controls['price'].value;
  }

  /**
   * Set price
   * Done with a facade method and not with a formControlName because it's not possible to bind a form to a button
   * 
   * @memberOf RecipeListComponent
   */
  set price(value) {
    this.searchForm.controls['price'].setValue(value);
  }

  /**
   * Get time
   * Done with a facade method and not with a formControlName because it's not possible to bind a form to a button
   * 
   * @memberOf RecipeListComponent
   */
  get time() {
    return this.searchForm.controls['time'].value;
  }

  /**
   * Set time
   * Done with a facade method and not with a formControlName because it's not possible to bind a form to a button
   * 
   * @memberOf RecipeListComponent
   */
  set time(value) {
    this.searchForm.controls['time'].setValue(value);
  }

  /**
   * On select a recipe, the modal is shown
   * 
   * @param {RecipeModel} recipe
   * 
   * @memberOf RecipeListComponent
   */
  selectRecipe(recipe: RecipeModel) {
    if(this.fromPlanner){
      this.closeRecipeList.emit({ valueState: true, recipeSelected: recipe});
    }
    else{
      (<any>$(this.modal)).modal('show');
      this.selectedRecipeId = recipe.id;
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
    this.closeRecipeList.emit({ valueState: false });
  }

  get isAdmin() {
    return this._storageService.settings.isAdmin;
  }

  navigateToRecipe(recipeId: Number) {
    this.closeModal();
    this._router.navigateByUrl(`recipes/${recipeId}`);
  }

  /**
   * Update State of favorite in recipe-list
   * 
   * @param {number} recipeId
   * @param {boolean} stateFavorite
   * 
   * @memberOf RecipeListComponent
   */
  updateStateFavorite(recipeId: number,stateFavorite: boolean){
    let elem = this.recipes.find(rec => rec.id === recipeId);
    if(elem){
      elem.isFavorite = stateFavorite;
    }

    let elem2 = this.suggestions.find(rec => rec.id === recipeId);
    if(elem2){
      elem2.isFavorite = stateFavorite;
    }

  }

  navigateToSettings() {
    this._router.navigateByUrl('settings');
  }

}