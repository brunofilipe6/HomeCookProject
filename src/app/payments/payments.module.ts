import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { PayPalButtonComponent } from './paypal-button/paypal-button.component';
import { PaymentsSuccessComponent } from './success/payments-success.component';
import { PaymentsCancelComponent } from './cancel/payments-cancel.component';
import { PaymentsService } from './shared/payments.service';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [
    PayPalButtonComponent,
    PaymentsSuccessComponent,
    PaymentsCancelComponent
  ],
  declarations: [
    PayPalButtonComponent,
    PaymentsSuccessComponent,
    PaymentsCancelComponent
  ],
  providers: [
    PaymentsService
  ]
})
export class PaymentsModule {

}
