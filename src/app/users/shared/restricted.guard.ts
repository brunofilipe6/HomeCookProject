import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { StorageService } from '../../shared/storage.service';
import { AuthService } from './auth.service';

@Injectable()
export class RestrictedGuard implements CanActivate {
  constructor(private _router: Router, private _authService: AuthService, private _storageService: StorageService) { }

  canActivate() {
    if (this._storageService.settings.isStakeholder || this._storageService.settings.isAdmin ) {
      return true;
    }
    else {
      // Navigate to default route
      this._router.navigateByUrl('');
      return false;
    }
  }
}