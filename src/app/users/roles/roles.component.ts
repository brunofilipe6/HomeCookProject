import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { StorageService } from '../../shared/storage.service';
import { NotificationsService } from '../../shared/notifications.service';
import { PaymentsService } from '../../payments/shared/payments.service';
import { SettingsService } from '../shared/settings.service';
import { Payment, CreditCardPayment, PayPalPayment, MultibancoPayment } from '../../payments/shared/payment.model';
import { Role, RoleEnum } from '../shared/role.model';

@Component({
  selector: 'roles',
  template: require('./roles.html')
})
export class RolesComponent {
  constructor() { }
}