import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { StorageService } from '../../shared/storage.service';

@Injectable()
export class FreeUserGuard implements CanActivate {
  constructor(private _router: Router, private _storageService: StorageService) { }

  canActivate() {
    if (this._storageService.settings.isFree) {
      return true;
    }
    else {
      return false;
    }
  }
}