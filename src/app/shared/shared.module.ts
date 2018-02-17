import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpManager } from './http.manager';
import { StorageService } from './storage.service';
import { NotificationsService } from './notifications.service';
import { PriceRatingComponent } from './price-rating/price-rating.component';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { BarClassificationComponent } from './bar-classification/bar-classification.component';
import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tabs/tab.component';
import { ErrorMessage } from './error-message/error-message.component';
import { SortButtonComponent } from './sort-button/sort-button.component';
import { ToggleButtonComponent } from './toggle-button/toggle-button.component';
import { FriendlyDatePipe } from './friendly-date.pipe';
import { SummaryPipe } from './summary.pipe';
import { CheckboxGroupComponent } from './checkbox-group/checkbox-group.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    PriceRatingComponent,
    StarRatingComponent,
    BarClassificationComponent,
    TabsComponent,
    TabComponent,
    ErrorMessage,
    SortButtonComponent,
    ToggleButtonComponent,
    FriendlyDatePipe,
    SummaryPipe,
    CheckboxGroupComponent
  ],
  declarations: [
    PriceRatingComponent,
    StarRatingComponent,
    BarClassificationComponent,
    TabsComponent,
    TabComponent,
    ErrorMessage,
    SortButtonComponent,
    ToggleButtonComponent,
    FriendlyDatePipe,
    SummaryPipe,
    CheckboxGroupComponent
  ],
  providers: [
    HttpManager,
    StorageService,
    NotificationsService
  ]
})
export class SharedModule { }