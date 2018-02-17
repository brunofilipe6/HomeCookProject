import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { NotificationsService } from '../../shared/notifications.service';
import { ValidationService } from '../../shared/validation.service';
import { RecipeService } from '../../recipes/shared/recipe.service';

import { RecipeModel } from '../../recipes/shared/recipe.model';
import { ListIngred } from '../shared/list-ingred.model';

/** Importar shared depois  */
import { RecipeIngredientLineModel } from '../../recipes/shared/recipe-ingredient-line.model'
import { UnitModel } from '../../recipes/shared/unit.model'
import { IngredientModel } from '../../recipes/shared/ingredient.model'
import { GroupModel } from '../../shared/checkbox-group/group.model';


@Component({
  selector: 'recipe-edit',
  template: require('./recipe-edit.html')
})
export class RecipeEditComponent {

  private subscription: Subscription;

  /** recive recipe */
  // @Input() recipe: RecipeModel;
  recipe: RecipeModel;
  // @Input() editRecipe: boolean;
  editRecipe: boolean;
  canSave: boolean = false;
  loaded: boolean = false;
  // @Output() closeModal = new EventEmitter<any>();

  units: UnitModel[] = [];  //todos as unidades
  ingreds: IngredientModel[] = [] //todos os ingredientes
  // listIngred: RecipeIngredientLineModel[] = []; //todos os ingredientes de uma receita
  lineIngreds: RecipeIngredientLineModel[] = []

  newIngred : RecipeIngredientLineModel; //Nova linha com o ingrediente 

  emptyIngred = new IngredientModel(-1,"Vazio");
  emptyUnit = new UnitModel(-1,"Vazio",false, "Vazio");
  valueEmptyLine: number = this.emptyIngred.id;

  numberRanking;

  groups: GroupModel[] = [];

  typeRecipes = ["Pequeno-Almoço","Almoço/Jantar"];
  
  recipeGroups: GroupModel[] = [];
  
  form: FormGroup;

  constructor(private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _recipeService: RecipeService,
    private _notificationsService: NotificationsService,
    private _elementRef: ElementRef) { }

  /**
   * 
   * 
   * 
   * @memberOf RecipeEditComponent
   */
  ngOnInit() {
    this.initForm();
    // NEW RECIPE 
    this.subscription = this._activatedRoute.params.subscribe(
      (param: any) => {
        let id = param['id'];
        if (id == "new"){
          this.recipe = new RecipeModel(-1, '', '', '', '', 0, 0, 0, 0, 0, false,0,[],[],'-1');
          this.editRecipe= false;
          this.loaded = true;
          this.lineIngreds = [];
          this.init();
        } else{
          Promise.all([
            this._recipeService.getRecipe(id),
            this._recipeService.getIngredientsRecipe(id)
          ])
          .then(values => {
            var r = values[0];
            this.recipe = r;
            this.editRecipe= true;
            var minutes = Date.parse("1970-01-01T" + this.recipe.time);
            this.recipe.time = minutes/60000;
            this.loaded = true;
            this.changeDifficult(this.recipe.difficulty);
            var listIngredients = values[1];
            this.lineIngreds = listIngredients;
            this.lineIngreds.forEach((elem: RecipeIngredientLineModel) => {
            this.addIngredientLineToForm(elem);
            });
            this.canSave = true;
            this.init();
            this.form.controls['typeRecipe'].setValue(r.isBreakfast);
          })
           .catch(error=>{this._notificationsService.error("Não foi possivel carregar a receita")})
 
        }
      }
    )

  }

  init(){

  /** Get all groups in DataBase */
  this._recipeService.getGroups()
    .then(groups => { 
        this.groups = groups;
        if(this.editRecipe){
          this._recipeService.getGroupsRecipe(this.recipe.id)
          .then(res => {
              for ( var i = 0; i < res.length; i++){
                let elem = this.groups.find(group => group.groupId === res[i].groupId);
                if(elem){
                  elem.groupActive = !elem.groupActive;
                }
              }
              this.form.controls['groups'].setValue(this.groups.filter(function(elem){
                return elem.groupActive === true;
              }));
          })
          .catch(_ => this._notificationsService.error('Não foi possível obter os grupos das receitas!'));
        }
    })
    .catch(_ => this._notificationsService.error('Não foi possível obter o detalhe das receitas!'));  

  this._recipeService.getAllIngredients()
      .then(ingredients => {
        this.ingreds = ingredients;

      })
      .catch(_ => {
        this._notificationsService.error('Não foi possível obter ingredientes')
      });


    this._recipeService.getIngredientsUnits()
      .then(listUnits => {
        this.units = listUnits;
      })
      .catch(_ => {
        this._notificationsService.error('Não foi possível obter unidades')
      });
  }

  getIngredientLineControl(ingredientLine: RecipeIngredientLineModel) {
    return this.form.controls[`ingredient-${ingredientLine.ingredient.id}`];
  }


  initForm() {
      this.form = this._formBuilder.group({
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(10)
        ]),
        description: new FormControl('', [
          Validators.required,
          Validators.minLength(50)
        ]),
        showDescription: new FormControl('', [
          Validators.required
        ]),
        price: new FormControl('', [
          Validators.required,
          ValidationService.number({ min: 1, max: 150 })
        ]),
        servings: new FormControl('', [
          Validators.required,
          ValidationService.number({ min: 1, max: 12 })
        ]),
        time: new FormControl('', [
          Validators.required,
          ValidationService.number({ min: 1, max: 5000 })
        ]),
        difficulty: new FormControl('',[
          Validators.required
        ]),
        groups: new FormControl('',[
          Validators.required
        ]),
        image: new FormControl('',[
          Validators.required
        ]),
        typeRecipe: new FormControl("",[
          Validators.required
        ])
      });

    this.lineIngreds.forEach((elem: RecipeIngredientLineModel) => {
      this.addIngredientLineToForm(elem);
    });
  }

  updateCategoryFood(categoryFood: GroupModel){
    let elem = this.groups.find(group => group.groupId === categoryFood.groupId);
    if(elem){
        elem.groupActive = !elem.groupActive;
    }
    this.form.controls['groups'].setValue(this.groups.filter(function(elem){
        return elem.groupActive === true;
    }));

    if(!this.form.controls['groups'].value.length){
      this.form.controls['groups'].setValue('');
    }

  }

  insertIngred() {
    var condition: boolean = false;
    this.lineIngreds.map(function (elem) {
      if (elem.ingredient.name === "Vazio" || elem.unit.name === "Vazio" || elem.quantity < 0) {
        condition = true;
        return;
      }
    });

    if(!condition && this.form.valid){
      var newIngred = new RecipeIngredientLineModel(
        this.valueEmptyLine--,
        0,
        this.emptyUnit,
        this.emptyIngred,
        this.recipe.id
      );
      this.lineIngreds.push(newIngred);
      this.addIngredientLineToForm(newIngred);
    }
  }

  deleteIngred(ingredientToDelete: RecipeIngredientLineModel) {
    var condition: boolean = false;

    this.lineIngreds.map(function (elem) {
      if (elem.ingredient.name === "Vazio" || elem.ingredient.name === "Vazio" || elem.quantity <= 0) {
        condition = true;
      }
    });

    if(condition){
      this.lineIngreds = this.lineIngreds.filter(function (ingred) {
        return ingred !== ingredientToDelete;
      });
      this.removeIngredientLineFromForm(ingredientToDelete);
    }
    //remover da BD
    this._recipeService.removeIngredientInRecipe(ingredientToDelete).then(res => {
        this._notificationsService.success("A Ingrediente removido com sucesso!")
      }).catch(error => {
        this._notificationsService.error('Não foi possível remover o ingrediente!');
      });
  }
  
  confirmIngred(ingredToConfirm: RecipeIngredientLineModel){
    var condition: boolean = false;
    
      if (oninvalid) {
        ValidationService.markControlsAsTouched(this.form);
        return;
      }

      // Alteracao aqui 
      this._recipeService.saveIngredientInRecipe(ingredToConfirm, this.recipe.id).then((res: any) => {
        ingredToConfirm.id = res.id;
          // if(ingredToConfirm.id < 0){
          // let elem = this.lineIngreds.find(line => ingredToConfirm.id === 1);
          // if(elem){
          //   elem.id = res.id;
          //   console.log(res);
          // }
          
        // }  
        this._notificationsService.success("Ingrediente inserido com sucesso!")
      }).catch(error => {
        this._notificationsService.error('Não foi possível inserir o ingrediente!');
      });
  }

  addIngredientLineToForm(ingredientLine: RecipeIngredientLineModel) {
    this.form.addControl(`ingredient-${ingredientLine.id}`, new FormControl(ingredientLine.quantity, [
      Validators.required,
      ValidationService.number({ min: 1 })
    ]));
  }

  removeIngredientLineFromForm(ingredientToDelete: RecipeIngredientLineModel) {
    this.form.removeControl(`ingredient-${ingredientToDelete.ingredient.id}`);
  }

  updateQuantity(ingred: RecipeIngredientLineModel, quantity: number){
    this.lineIngreds.map(function (elem) {
      if (ingred.id === elem.id) {
        elem.quantity = quantity;
      }
    });
  }

  updateUnit(ingred: RecipeIngredientLineModel, unitName: String) {
    var unitAux = this.units.filter(function (elem) {
      return elem.name === unitName;
    })[0];
    
    this.lineIngreds.map(function (elem) {
      if (ingred.id === elem.id) {
        elem.unit = unitAux;
      }
    });
  }

  updateIngred(ingred:RecipeIngredientLineModel, ingredName: String) {
    
    var ingredAux = this.ingreds.filter(function(elem) {
      return elem.name === ingredName;
    })[0];

    this.lineIngreds.map(function (elem) {
      if (ingred.id === elem.id) {
        elem.ingredient = ingredAux;
      }
    });
  }
  
  validateIngred(productName){
      var condition : boolean = false;
      this.lineIngreds.map(function(elem){
        if(elem.ingredient.name === productName){
          condition = true;
          return;
        }
      });
      return condition;
  }

  saveRecipe() {
    var condition: boolean = false;

     this.lineIngreds.map(function (elem) {
      if (elem.ingredient.name === "Vazio" || elem.ingredient.name === "Vazio" || elem.quantity < 0) {
        condition = true;
      }
    });

    // if(!this.editRecipe && !this.canSave && !condition && this.form.valid){
    //    this.insertIngred();
    //    this.canSave = true;
    // }
    
    if(!condition){
      if (!this.form.valid) {
        ValidationService.markControlsAsTouched(this.form);
        return;
      }

      if(!this.editRecipe && !this.canSave && !condition && this.form.valid){
        this.insertIngred();
        this.canSave = true;
      }

      if(this.recipe.isBreakfast == "1"){
        this.form.controls['typeRecipe'].setValue(0);
      }
      else{
        this.form.controls['typeRecipe'].setValue(1);

      }
      
      var data = new Date(this.form.controls['time'].value*60000);
      let recipe = new RecipeModel(
        this.recipe.id, 
        this.form.controls['name'].value,
        this.form.controls['description'].value,
        this.form.controls['showDescription'].value,
        this.recipe.image,
        this.form.controls['servings'].value,
        this.recipe.rating,
        this.form.controls['price'].value,
        parseInt(("0" + data.getHours()).slice(-2) + ("0" + data.getMinutes()).slice(-2) + ("0" + data.getSeconds()).slice(-2)),
        this.form.controls['difficulty'].value,
        this.recipe.isFavorite, 
        1, // é ignorado do outro lado, valor default
        [],
        this.form.controls['groups'].value,
        this.form.controls['typeRecipe'].value
      );

      //gravar os grupos
      this.recipeGroups = this.groups.filter(function(elem){
        return elem.groupActive === true;
      }); 
           
      if(this.editRecipe){ 
        this._recipeService.saveRecipeEdit(recipe)
          .then(res => {
            this._notificationsService.success("A receita foi atualizada com sucesso!");
           })
          .catch(error => {
            this._notificationsService.error('Não foi possível atualizar a receita!');
          });

        this._recipeService.saveRecipeGroups(this.recipe.id, this.recipeGroups)
          .then(res => {})
          .catch(error => {
              this._notificationsService.error('Grupos das receitas não foram atualizados!');
          });
      }
      else{
         this._recipeService.saveRecipeCreate(recipe)
          .then(res => {
            this.recipe.id = res.id;
            this.editRecipe = true;
            this._recipeService.saveRecipeGroups(res.id, this.recipeGroups)
              .then(res => {
                this._notificationsService.success("A receita foi criada com sucesso!");
              })
              .catch(error => {
                  this._notificationsService.error('Grupos das receitas não foram atualizados!');
              });
          })
          .catch(error => {
            this._notificationsService.error('Não foi possível salvar a receita!');
          });
      }    
    }
  }

  changeDifficult(number: number){
    this.recipe.difficulty = number;
    this.form.controls['difficulty'].setValue(number);
  }
  changeType(number: string){
    this.recipe.isBreakfast = number;
    this.form.controls['typeRecipe'].setValue(number);
  }
  
}
