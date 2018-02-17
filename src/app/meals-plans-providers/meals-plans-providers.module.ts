import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app.routing.module';
import { SharedModule } from '../shared/shared.module';
import { RecipesModule } from '../recipes/recipes.module';
import { PaymentsModule } from '../payments/payments.module';
import { MealPlanner } from './meals/meal-planner/meal-planner.component';
import { MealPreviewComponent } from './meals/meal-preview/meal-preview.component';
import { PlanDetailComponent } from './plans/plan-detail/plan-detail.component';
import { AdminPlanListComponent } from './plans/admin-plan-list/admin-plan-list.component';
import { PlanMakerComponent } from './plans/plan-maker/plan-maker.component';
import { PlansComponent } from './plans/plans/plans.component';
import { PlanViewerComponent } from './plans/plan-viewer/plan-viewer.component';
import { ProviderViewerComponent } from './providers/provider-viewer/provider-viewer.component';
import { ProviderProfileComponent } from './providers/provider-profile/provider-profile.component';
import { PlanMealPipe } from './plans/shared/plan-meal.pipe';
import { PlanViewerPipe } from './plans/shared/plan-viewer.pipe';
import { MealService } from './meals/shared/meal.service';
import { PlanService } from './plans/shared/plan.service';
import { ProviderService } from './providers/shared/provider.service';

@NgModule({
  imports: [
    RouterModule,
    AppRoutingModule,
    SharedModule,
    RecipesModule,
    PaymentsModule
  ],
  exports: [
    MealPreviewComponent,
    AdminPlanListComponent,
    PlanViewerComponent,
    ProviderViewerComponent
  ],
  declarations: [
    MealPlanner,
    MealPreviewComponent,
    PlanMakerComponent,
    AdminPlanListComponent,
    PlansComponent,
    PlanDetailComponent,
    PlanViewerComponent,
    PlanMealPipe,
    ProviderViewerComponent,
    ProviderProfileComponent,
    PlanViewerPipe
  ],
  providers: [
    MealService,
    PlanService,
    ProviderService
  ]
})
export class MealsPlansProvidersModule { }
