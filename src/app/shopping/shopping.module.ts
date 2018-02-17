import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { ShoppingItemService } from './shared/shopping-item.service';
import { IngredientCategoryService } from './shared/ingredient-category.service';

import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { CalculateQuantityPipe } from './shared/calculate-quantity.pipe';
import { AbbreviateUnitPipe } from './shopping-list/abbreviate-unit.pipe';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [],
  declarations: [
    ShoppingListComponent,
    CalculateQuantityPipe,
    AbbreviateUnitPipe
  ],
  providers: [
    ShoppingItemService,
    IngredientCategoryService
  ]
})
export class ShoppingModule {

}