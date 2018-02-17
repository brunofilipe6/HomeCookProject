import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../shared/auth.service';
import { StorageService } from '../../shared/storage.service';
import { SettingsService } from '../../users/shared/settings.service';
import { Role, RoleEnum } from '../shared/role.model';

@Component({
  selector: 'landing',
  template: require('./landing.html')
})
export class LandingComponent {
  constructor(private _router: Router, private _authService: AuthService, private _storageService: StorageService, private _settingsService: SettingsService) { }

  ngOnInit() {
    this._authService.logout();
  }

  get premiumRole() {
    return new Role(RoleEnum.Premium, "premium");
  }

  authenticate() {
    this._authService.show().subscribe(_ => this.getSettings());
  }

  getSettings() {
    this._settingsService.getSettings().then(res => {
      this._storageService.settings = res;
      this._router.navigateByUrl('home');
    });
  }

  private _navigateTo(path: string) {
    return this._router.navigateByUrl(path);
  }

  private _navigateToTarget(target: string){
     $('html, body').animate({
        scrollTop: $(target).offset().top
    }, 1000);
  }
}