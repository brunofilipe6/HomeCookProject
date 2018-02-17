// Angular and RxJS modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import * as rx from 'rxjs/Rx';
import { MetaModule, MetaConfig, MetaService } from 'ng2-meta';

// Custom modules
import { AppRoutingModule } from './app.routing.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { BackOfficeModule } from './backoffice/backoffice.module';
import { RecipesModule } from './recipes/recipes.module';
import { MealsPlansProvidersModule } from './meals-plans-providers/meals-plans-providers.module';
import { ShoppingModule } from './shopping/shopping.module';
import { PaymentsModule } from './payments/payments.module';
import { IngredientsModule } from './ingredients/ingredients.module';

// Custom components and services
import { AppComponent } from './app.component';

const metaConfig: MetaConfig = {
  //Append a title suffix such as a site name to all titles
  //Defaults to false
  useTitleSuffix: false,
  defaults: {
    title: 'Homecook - Planeia as tuas refeições',
    titleSuffix: ' | Homecook',
    'og:title': 'Homecook - Planeia as tuas refeições',
    'og:description': 'Planeia as tuas refeições. Organiza a tua cozinha.',
    'og:url': 'http://homecook.pt',
    'og:image': 'http://homecook.pt/assets/landing_full.jpg'
  }
};

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    SharedModule,
    UsersModule,
    BackOfficeModule,
    RecipesModule,
    ShoppingModule,
    PaymentsModule,
    MealsPlansProvidersModule,
    IngredientsModule,
    MetaModule.forRoot(metaConfig)
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {

}
