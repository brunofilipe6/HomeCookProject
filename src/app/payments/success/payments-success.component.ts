import { Component, ElementRef, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { StorageService } from '../../shared/storage.service';
import { NotificationsService } from '../../shared/notifications.service';
import { SettingsService } from '../../users/shared/settings.service';
import { Settings } from '../../users/shared/settings.model';
import { PaymentsService } from '../shared/payments.service';
import { Payment, CreditCardPayment, PayPalPayment, MultibancoPayment } from '../shared/payment.model';

@Component({
  selector: 'payments-success',
  template: require('./payments-success.html')
})
export class PaymentsSuccessComponent {
  item_name: String;

  constructor(private _route: ActivatedRoute, private _storageService: StorageService, private _settingsService: SettingsService, private _notificationsService: NotificationsService, private _paymentsService: PaymentsService) { }

  ngOnInit() {
    const { amt, cc, charset, item_name, st, tx } = (<any>this._route.queryParams).value;
    this.item_name = item_name;

    this._paymentsService.postPayment(new PayPalPayment(amt, cc, charset, item_name, st, tx)).then((res: any) => {
      this._settingsService.getSettings().then((settings: Settings) => {
        this._storageService.settings = settings;
      })
      .catch(error => {
        this._notificationsService.error('Não foi possível carregar as suas preferências');
      })
    }).catch(error => {
      this._notificationsService.error('Não foi possível guardar novo pagamento');
    });
  }
}