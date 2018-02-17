import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { ProviderModel } from '../shared/provider.model';
import { ProviderService } from '../shared/provider.service';
import { NotificationsService } from '../../../shared/notifications.service';

@Component({
  selector: 'provider-viewer',
  template: require('./provider-viewer.html'),
})
export class ProviderViewerComponent implements OnInit {
  providers: ProviderModel[] = [];

  constructor(
    private _providerService: ProviderService, 
    private _notificationsService: NotificationsService,
    private _router:Router) { }

  ngOnInit() {
    this._providerService.getProviders()
      .then(res => this.providers = res)
      .catch(error => this._notificationsService.error('Não foi possível obter provedores') );
  }

  /**
   * Move to page of provider
   * 
   * @param {number} providerId
   * 
   * @memberOf ProviderViewerComponent
   */
  redirect(providerId: number){
    this._router.navigateByUrl("/providers/"+providerId);
  }
}
