import { Injectable, EventEmitter } from '@angular/core';
import { Response } from '@angular/http';
import * as jwtDecode from 'jwt-decode';

import { HttpManager } from '../../shared/http.manager';
import { StorageService } from '../../shared/storage.service';
import { Settings } from './settings.model';
import { Role, RoleEnum } from './role.model';

@Injectable()
export class AuthService {
  showEmitter = new EventEmitter();

  constructor(private _httpManager: HttpManager, private _storageService: StorageService) { }

  /**
   * Emits an emitter as a mean to display related information to the user
   * 
   * @returns {EventEmitter<any>}
   * 
   * @memberOf AuthService
   */
  public show(): EventEmitter<any> {
    let response = new EventEmitter();
    this.showEmitter.emit(response);
    return response;
  }

  /**
   * Logs the user in the system
   * 
   * @param {String} email
   * @param {String} password
   * @returns {Promise<any>}
   * 
   * @memberOf AuthService
   */
  public login(email: String, password: String): Promise<any> {
    return this._httpManager.post('auth/login', { email: email, password: password })
      .toPromise()
      .then((response: any) => this._storageService.token = response);
  }

  /**
   * Registers the user in the system
   * 
   * @param {String} email
   * @param {String} password
   * @returns {Promise<any>}
   * 
   * @memberOf AuthService
   */
  public register(email: String, password: String): Promise<any> {
    return this._httpManager.post('auth/register', { email: email, password: password })
      .toPromise()
      .then((response: any) => this._storageService.token = response);
  }

  /**
   * Checks whether the user is logged in
   * 
   * @returns {Boolean}
   * 
   * @memberOf AuthService
   */
  public isLoggedIn(): Boolean {
    return Boolean(this._storageService.token);
  }
  
  /**jwt-decode
   * Logs the user out
   * 
   * 
   * @memberOf AuthService
   */
  public logout() {
    this._storageService.clear();
  }
}
