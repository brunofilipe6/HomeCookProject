import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StorageService } from '../../../shared/storage.service';
import { PlanModel } from '../shared/plan.model';

@Component({
  selector: 'plan-viewer',
  template: require('./plan-viewer.html')
})

export class PlanViewerComponent {
    
    /** Recive Plan */
    @Input() plan: PlanModel;

    /** Come From Provider = yes, come from plans = false*/
    @Input() comeFromProvider: boolean;

    /** appear price */
    @Input() price: boolean;


    /** Limit Description */
    limitDescription: Number = 60;

    constructor(private _router: Router,private _storageService: StorageService) { }
    
    /**
     * Get Price of Plan
     * 
     * @param {PlanModel} plan
     * @returns
     * 
     * @memberOf PlanViewerComponent
     */
    get planPrice() {
      return this.plan.getPriceToLocaleString(this._storageService.settings.isFree);
    }

    /**
     * Plan Detail
     * 
     * @param {PlanModel} plan
     * 
     * @memberOf PlanViewerComponent
     */
    onClickedPlan(plan: PlanModel) {
      this._router.navigateByUrl(`plans/${plan.id}`);
    }
}