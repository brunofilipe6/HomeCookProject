import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { UsersModule } from '../users/users.module';
import { RecipeService } from './shared/recipe.service';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipePreviewComponent } from './recipe-preview/recipe-preview.component';
import { AdminRecipeListComponent } from './admin-recipe-list/admin-recipe-list.component';
import { AppRoutingModule } from '../app.routing.module';

@NgModule({
  imports: [
    SharedModule,
    AppRoutingModule,
    FormsModule,
    UsersModule
  ],
  exports: [
    RecipePreviewComponent,
    RecipeListComponent,
    AdminRecipeListComponent,
    RecipeDetailComponent
  ],
  declarations: [
    RecipeDetailComponent,
    RecipeListComponent,
    AdminRecipeListComponent,
    RecipePreviewComponent
  ],
  providers: [
    RecipeService
  ]
})
export class RecipesModule {

}
