import { ProviderModel } from '../../providers/shared/provider.model';

export class PlanModel {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public minPrice: number,
    public maxPrice: number,
    public planType: string,
    public provider: ProviderModel,
    public bought: Boolean) { }

  getPrice(isFree: Boolean) {
    return isFree ? this.maxPrice : this.minPrice;
  }
  
  getPriceToLocaleString(isFree: Boolean) {
    return this.getPrice(isFree).toLocaleString(undefined, { minimumFractionDigits: 2 });
  }

  static getPlanTypes() {
    return [
      'Full',
      'Breakfast',
      'Lunch',
      'Dinner'
    ];
  }

  get planTypePT() {
    if (this.isPlanTypeFull){
      return "Completo";
    }
    if (this.isPlanTypeBreakfast){
      return "Pequeno-Almoço";
    }
    if (this.isPlanTypeLunch){
      return "Almoço";
    }
    else{
      // this.isPlanTypeDinner
      return "Jantar";
    }
  }

  get isPlanTypeFull() {
    return this.planType == PlanModel.getPlanTypes()[0];
  }

  get isPlanTypeBreakfast() {
    return this.planType == PlanModel.getPlanTypes()[1];
  }

  get isPlanTypeLunch() {
    return this.planType == PlanModel.getPlanTypes()[2];
  }

  get isPlanTypeDinner() {
    return this.planType == PlanModel.getPlanTypes()[3];
  }
}
