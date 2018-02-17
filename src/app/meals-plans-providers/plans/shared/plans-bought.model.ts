import { PlanModel } from './plan.model';

export class PlanBoughtModel {
  constructor(
    public plan: PlanModel,
    public bought: boolean) { }
}
