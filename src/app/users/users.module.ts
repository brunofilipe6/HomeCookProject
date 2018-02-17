import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { PaymentsModule } from '../payments/payments.module';
import { AuthGuard } from './shared/auth.guard';
import { RestrictedGuard } from './shared/restricted.guard';
import { FreeUserGuard } from './shared/free-user.guard';
import { AdminGuard } from './shared/admin.guard';
import { AuthService } from './shared/auth.service';
import { SettingsService } from './shared/settings.service';
import { AuthLock } from './auth-lock/auth-lock.component';
import { LandingComponent } from './landing/landing.component';
import { Features } from './landing/features/features.component';
import { PricePlans } from './landing/price-plans/price-plans.component';
import { SettingsComponent } from './settings/settings.component';
import { RolesComponent } from './roles/roles.component';
import { IngredientService } from './shared/ingredient.service';

@NgModule({
  imports: [
    SharedModule,
    PaymentsModule
  ],
  exports: [
    AuthLock,
    RolesComponent
  ],
  declarations: [
    AuthLock,
    LandingComponent,
    Features,
    PricePlans,
    SettingsComponent,
    RolesComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    RestrictedGuard,
    FreeUserGuard,
    AdminGuard,
    SettingsService,
    IngredientService
  ]
})
export class UsersModule {

}