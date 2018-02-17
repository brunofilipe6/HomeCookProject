import { Component, Input, Output, EventEmitter, ElementRef  } from '@angular/core';

import { NotificationsService } from '../../../shared/notifications.service';
import { PlanService } from '../shared/plan.service';
import { PlanModel } from '../shared/plan.model';


@Component({
  selector: 'admin-plan-list',
  template: require('./admin-plan-list.html')
})

export class AdminPlanListComponent {

  plans : PlanModel[];

  constructor(private _notificationsService : NotificationsService, private _planService: PlanService) { }

  ngOnInit() {
    
    // Fetch plans
    this._planService.getOwnPlans()
      .then(
        plans_list => {
          this.plans = plans_list;
        }
      )
      .catch( 
        error => {
          // Notify user
          this._notificationsService.error('Não foi possível carregar lista de planos');
        }
      );
  }

  deletePlan(plan) {

    this._planService.delete(plan)
      .then( 
        ok => {
          var id = plan.id;
          this.plans = this.plans.filter(function (plan) {
            return plan.id !== id;
          });
          this._notificationsService.success('Plano eliminado');
        }
      )
      .catch( 
        error => {
          // Notify user
          this._notificationsService.error('Não foi possível eliminar o plano');
        }
      );
  }

}
