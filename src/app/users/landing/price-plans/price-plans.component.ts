import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Role, RoleEnum } from '../../shared/role.model';
import { PricePlan, Feature, PricePlanFeature } from './price-plans-models';

@Component({
  selector: 'price-plans',
  template: require('./price-plans.html')
})
export class PricePlans {
  @Input() isClickable = false;
  @Input() role;
  @Output() roleChange = new EventEmitter();

  plans: PricePlan[];
  features: Feature[];

  ngOnInit() {
    this.features = [
      new Feature(0, 'Receitas de qualidade para diversificar a tua alimentação.'),
      new Feature(1, 'Organiza facilmente as tuas refeições com o planeador.'),
      new Feature(2, 'Compra planos de refeições completos.'),
      new Feature(3, 'Usa a lista de compras para saberes exatamente o que tens de comprar nas idas ao supermercado.'),
      new Feature(4, 'Descontos na compra de planos alimentares.'),
      new Feature(5, 'Sugestões de refeições baseadas no teu perfil e nos teus gostos.')
    ];

    this.plans = [
      new PricePlan(RoleEnum.Free, 'Grátis', 'free', 0, this.isFree, [
        new PricePlanFeature(RoleEnum.Free, 0, true),
        new PricePlanFeature(RoleEnum.Free, 1, true),
        new PricePlanFeature(RoleEnum.Free, 2, true),
        new PricePlanFeature(RoleEnum.Premium, 3, false),
        new PricePlanFeature(RoleEnum.Premium, 4, false),
        new PricePlanFeature(RoleEnum.Premium, 5, false)
      ]),
      new PricePlan(RoleEnum.Premium, 'Premium', 'premium', 2.99, this.isPremium, [
        new PricePlanFeature(RoleEnum.Premium, 0, true),
        new PricePlanFeature(RoleEnum.Premium, 1, true),
        new PricePlanFeature(RoleEnum.Premium, 2, true),
        new PricePlanFeature(RoleEnum.Premium, 3, true),
        new PricePlanFeature(RoleEnum.Premium, 4, true),
        new PricePlanFeature(RoleEnum.Premium, 5, true)
      ])
    ];
  }

  getFeatureName(featureId: Number) {
    return this.features.find(feature => feature.id === featureId).name;
  }

  get isFree() {
    return this.role && this.role.id == RoleEnum.Free;
  }

  get isPremium() {
    return this.role && this.role.id == RoleEnum.Premium;
  }

  selectPlan(plan: PricePlan) {
    this.roleChange.emit(new Role(<any>plan.id, plan.description));
  }
}