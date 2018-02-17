export abstract class Payment {
  
}

export class CreditCardPayment extends Payment {
  constructor(
    public number: String,
    public name: String,
    public expiration: String,
    public cvc: Number) { super(); }
}

export class PayPalPayment extends Payment  {
  constructor(
    public amt: String,
    public cc: String,
    public charset: String,
    public item_name: String,
    public st: String,
    public tx: String) { super(); }
}

export class MultibancoPayment extends Payment  {
  constructor() { super(); }
}