import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { RecipesModule } from '../recipes/recipes.module';
import { MealsPlansProvidersModule } from '../meals-plans-providers/meals-plans-providers.module';

import { AdminComponent } from './admin/admin.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { AppRoutingModule } from '../app.routing.module';
// import { AuthGuard } from './shared/ auth.guard';
// import { AuthService } from './shared/ auth.service';


@NgModule({
  imports: [
    SharedModule,
    RecipesModule,
    MealsPlansProvidersModule,
    AppRoutingModule,
    
  ],
  exports: [
    AdminComponent
  ],
  declarations: [
    AdminComponent,
    RecipeEditComponent
  ],
  providers: [
    // AuthService,
    // AuthGuard
  ]
})

export class BackOfficeModule { }
