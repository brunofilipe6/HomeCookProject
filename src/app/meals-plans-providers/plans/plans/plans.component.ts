import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationsService } from '../../../shared/notifications.service';
import { PlanService } from '../shared/plan.service';
import { PlanModel } from '../shared/plan.model';
import { ProviderModel } from '../../providers/shared/provider.model';

@Component({
  selector: 'plans',
  template: require('./plans.html')
})

export class PlansComponent implements OnInit {
  
  boughtPlans: PlanModel[] = [];
  plans: PlanModel[] = [];

  constructor(private _router: Router, private _notificationsService: NotificationsService, private _planService: PlanService) { }

  ngOnInit() {
    this._planService.getBoughtPlans()
      .then(res => this.boughtPlans = res)
      .catch(error => this._notificationsService.error('Não foi possível carregar os seus planos'))

    this._planService.getPlans()
      .then(res => { this.plans = res; })
      .catch(error => this._notificationsService.error('Não foi possível carregar os planos'))
  }

}