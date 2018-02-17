import { Injectable, EventEmitter } from '@angular/core';
import { Response, URLSearchParams } from '@angular/http';

import { HttpManager } from '../../shared/http.manager';
import { Payment, CreditCardPayment, PayPalPayment, MultibancoPayment } from './payment.model';

@Injectable()
export class PaymentsService {
  endpoint: String = 'payments';

  constructor(private _httpManager: HttpManager) { }

  /**
   * Facade method to perform a payment
   * 
   * @param {Payment} payment
   * @returns
   * 
   * @memberOf PaymentsService
   */
  public postPayment(payment: Payment) {
    if(payment instanceof CreditCardPayment) {
      return this.postCreditCardPayment(payment);
    }
    else if(payment instanceof PayPalPayment) {
      return this.postPayPalPayment(payment);
    }
    else if(payment instanceof MultibancoPayment) {
      return this.postMultibancoPayment(payment);
    }
  }

  /**
   * 
   * 
   * @private
   * @param {CreditCardPayment} payment
   * @returns
   * 
   * @memberOf PaymentsService
   */
  private postCreditCardPayment(payment: CreditCardPayment) {
    // TODO (tbragaf, 04/01/2017): This is but a mock to a payment
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  /**
   * 
   * 
   * @private
   * @param {PayPalPayment} payment
   * @returns
   * 
   * @memberOf PaymentsService
   */
  private postPayPalPayment(payment: PayPalPayment) {
    return this._httpManager.post(`${this.endpoint}/paypal_pdt`, payment)
      .map(res => res)
      .toPromise();
  }

  /**
   * 
   * 
   * @private
   * @param {MultibancoPayment} payment
   * @returns
   * 
   * @memberOf PaymentsService
   */
  private postMultibancoPayment(payment: MultibancoPayment) {
    // TODO (tbragaf, 04/01/2017): This is but a mock to a payment
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}
