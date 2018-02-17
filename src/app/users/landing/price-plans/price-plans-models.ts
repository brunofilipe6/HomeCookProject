export class PricePlan {
  constructor(
    public id: Number,
    public name: String,
    public description: String,
    public price: Number,
    public selected: Boolean,
    public features: PricePlanFeature[]) { }
}

export class PricePlanFeature {
  constructor(
    public pricePlanId: Number,
    public featureId: Number,
    public isAvailable: Boolean) { }
}

export class Feature {
  constructor(
    public id: Number,
    public name: String) { }
}