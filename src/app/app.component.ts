import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { AuthService } from './users/shared/auth.service';
import { StorageService } from './shared/storage.service';
import { SettingsService } from './users/shared/settings.service';
import { Settings } from './users/shared/settings.model';
import { NotificationsService } from './shared/notifications.service';

import './app.scss';

@Component({
  selector: 'app',
  template: require('./app.html')
})
export class AppComponent implements OnInit {
  constructor(private _router: Router, private _authService: AuthService, private _storageService: StorageService, private _settingsService: SettingsService, private _notificationsService: NotificationsService) { }

  ngOnInit() {
    const navbar: any = $('nav');

    navbar.affix({
      offset: {
        top: 60
      }
    });

    this._router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        $('#navbar').removeClass('in');
      }
    })
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

  get isLoggedIn() {
    return this._authService.isLoggedIn();
  }

  get isFreeUser() {
    return this._storageService.settings && this._storageService.settings.isFree;
  }

  get hasRestrictedAccess() {
    return this._storageService.settings && (this._storageService.settings.isStakeholder || this._storageService.settings.isAdmin);
  }

  logout() {
    this._authService.logout();
    this._navigateTo('landing');
  }

  private _navigateTo(path: string) {
    return this._router.navigateByUrl(path);
  }

  private _navigateToTarget(target: string) {
    $('html, body').animate({
      scrollTop: $(target).offset().top
    }, 1000);
  }

}