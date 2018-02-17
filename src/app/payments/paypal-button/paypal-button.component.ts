import { Component, Input } from '@angular/core';

@Component({
  selector: 'paypal-button',
  template: require('./paypal-button.html')
})
export class PayPalButtonComponent {
  @Input() subscription: Boolean = false;
  @Input() id: Number = 0;
  @Input() price: Number = 0;

  submit(form: HTMLFormElement, event: Event) {
    form.action = 'https://www.paypal.com/cgi-bin/webscr';
    form.method = 'post';
    form.target = '_top';

    this.appendInput(form, 'cmd', '_xclick');
    this.appendInput(form, 'business', 'HQ3L4QF6N67NC');
    this.appendInput(form, 'lc', 'PT');
    this.appendInput(form, 'item_name', 'Plano');
    this.appendInput(form, 'item_number', 'plan');
    this.appendInput(form, 'button_subtype', 'services');
    this.appendInput(form, 'no_note', '1');
    this.appendInput(form, 'no_shipping', '1');
    this.appendInput(form, 'rm', '1');
    this.appendInput(form, 'return', 'http://homecook.pt/#/payments/success');
    this.appendInput(form, 'cancel_return', 'http://homecook.pt/#/payments/cancel');
    this.appendInput(form, 'currency_code', 'EUR');
    this.appendInput(form, 'bn', 'PP-BuyNowBF:btn_buynowCC_LG.gif:NonHosted');
    this.appendInput(form, 'amount', this.price.toString());
    this.appendInput(form, 'custom', this.id.toString());
  }

  private appendInput(form: HTMLElement, inputName: string, inputValue: string) {
    let input = document.createElement('input');
    input.type = 'hidden';
    input.name = inputName;
    input.value = inputValue;

    form.appendChild(input);
  }
}