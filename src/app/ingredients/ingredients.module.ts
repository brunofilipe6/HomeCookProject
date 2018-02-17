import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { IngredientListComponent } from './ingredient-list/ingredient-list.component';
import { IngredientService } from './shared/ingredient.service';

@NgModule({
  imports: [
    SharedModule,
    FormsModule
  ],
  exports: [

  ],
  declarations: [
    IngredientListComponent
  ],
  providers: [
    IngredientService
  ]
})
export class IngredientsModule {

}
