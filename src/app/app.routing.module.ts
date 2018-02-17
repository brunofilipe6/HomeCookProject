import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './users/shared/auth.guard';
import { RestrictedGuard } from './users/shared/restricted.guard';
import { FreeUserGuard } from './users/shared/free-user.guard';
import { AdminGuard } from './users/shared/admin.guard';
import { AdminComponent } from './backoffice/admin/admin.component';
import { LandingComponent } from './users/landing/landing.component';
import { MealPlanner } from './meals-plans-providers/meals/meal-planner/meal-planner.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { PlansComponent } from './meals-plans-providers/plans/plans/plans.component';
import { PlanDetailComponent } from './meals-plans-providers/plans/plan-detail/plan-detail.component';
import { SettingsComponent } from './users/settings/settings.component';
import { ShoppingListComponent } from './shopping/shopping-list/shopping-list.component';
import { PlanMakerComponent } from './meals-plans-providers/plans/plan-maker/plan-maker.component';
import { ProviderProfileComponent } from './meals-plans-providers/providers/provider-profile/provider-profile.component';
import { RolesComponent } from './users/roles/roles.component';
import { PaymentsSuccessComponent } from './payments/success/payments-success.component';
import { PaymentsCancelComponent } from './payments/cancel/payments-cancel.component';
import { RecipeEditComponent } from './backoffice/recipe-edit/recipe-edit.component';
import { IngredientListComponent } from './ingredients/ingredient-list/ingredient-list.component';

const routes = [
  // public routes
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  // private routes
  { path: 'home', component: MealPlanner, canActivate: [AuthGuard] },
  { path: 'recipe-list', component: RecipeListComponent, canActivate: [AuthGuard] },
  { path: 'recipes/:id', component: RecipeDetailComponent, canActivate: [] },
  { path: 'plans', component: PlansComponent, canActivate: [AuthGuard] },
  { path: 'plans/:id', component: PlanDetailComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'shopping-list',  component: ShoppingListComponent, canActivate: [AuthGuard] },
  { path: 'providers/:id', component: ProviderProfileComponent },
  { path: 'providers', component: ProviderProfileComponent },
  { path: 'premium',  component: RolesComponent, canActivate: [AuthGuard, FreeUserGuard] },
  { path: 'payments/success',  component: PaymentsSuccessComponent, canActivate: [AuthGuard] },
  { path: 'payments/cancel',  component: PaymentsCancelComponent, canActivate: [AuthGuard] },
  // private and restricted routes
  { path: 'manage-content',  component: AdminComponent, canActivate: [AuthGuard, RestrictedGuard] },
  { path: 'manage-content/manage-plan/:id',  component: PlanMakerComponent, canActivate: [AuthGuard, RestrictedGuard] },
  { path: 'manage-content/manage-recipe/:id',  component: RecipeEditComponent, canActivate: [AuthGuard, RestrictedGuard] },
  { path: 'ingredients',  component: IngredientListComponent, canActivate: [AuthGuard, AdminGuard] }

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
