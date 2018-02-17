import { Component, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as $ from 'jquery';

import { AuthService } from '../shared/auth.service';
import { NotificationsService } from '../../shared/notifications.service';
import { TabsComponent } from '../../shared/tabs/tabs.component';
import { ValidationService } from '../../shared/validation.service';

enum AuthMode {
  Login,
  Register
}

@Component({
  selector: 'auth-lock',
  template: require('./auth-lock.html')
})
export class AuthLock {
  @ViewChild(TabsComponent) tabsComponent: TabsComponent;

  loginForm: FormGroup;
  registerForm: FormGroup;
  modal: HTMLElement;
  responseEmitter: EventEmitter<any>;

  constructor(private _elementRef: ElementRef, private _formBuilder: FormBuilder, private _authService: AuthService, private _notificationsService: NotificationsService) { }

  ngOnInit() {
    this.initForms();
    this.waitForAuthentication();
  }

  ngAfterViewInit() {
    this.modal = this._elementRef.nativeElement.children[0];
  }

  /**
   * Initializes both login and register forms
   * 
   * 
   * @memberOf AuthLock
   */
  initForms() {
    // Inits the login form
    this.loginForm = this._formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        ValidationService.emailValidator
      ]),
      password: new FormControl('', [
        Validators.required,
        ValidationService.passwordValidator
      ])
    });

    // Inits the register form
    this.registerForm = this._formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        ValidationService.emailValidator
      ]),
      passwords: new FormGroup({
        password: new FormControl('', [
          Validators.required,
          ValidationService.passwordValidator
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          ValidationService.passwordValidator
        ])
      }, ValidationService.passwordMatchValidator),
    });
  }

  /**
   * Waits for the user to ask to provide his authentication properties
   * 
   * 
   * @memberOf AuthLock
   */
  waitForAuthentication() {
    this._authService.showEmitter.subscribe(res => {
      this.resetForms();
      (<any>$(this.modal)).modal('show');

      this.responseEmitter = res;
    });
  }

  /**
   * Login method
   * 
   * 
   * @memberOf AuthLock
   */
  login() {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;

    if (!this.loginForm.valid) {
      ValidationService.markControlsAsTouched(this.loginForm);
      return;
    }

    this._authService.login(email, password).then(_ => {
      this.close(true);
    }).catch(error => {
      this._notificationsService.error('Login inválido');
    });
  }

  /**
   * Register method
   * 
   * 
   * @memberOf AuthLock
   */
  register() {
    const email = this.registerForm.get('email').value;
    const password = this.registerForm.get('passwords').get('password').value;

    if (!this.registerForm.valid) {
      ValidationService.markControlsAsTouched(this.registerForm);
      return;
    }

    this._authService.register(email, password).then(_ => {
      this.close(true);
      this._notificationsService.success('Bem-vindo ao Homecook!');      
    }).catch(error => {
      this._notificationsService.error('Registo inválido');
    });
  }

  /**
   * Close the modal
   * 
   * @param {Boolean} emitResponse
   * 
   * @memberOf AuthLock
   */
  close(emitResponse: Boolean) {
    if (emitResponse) {
      this.responseEmitter.emit();
    }

    this.responseEmitter = null;
    this.resetForms();
    (<any>$(this.modal)).modal('hide');
  }

  /**
   * Resets both forms to the original state 
   * 
   * 
   * @memberOf AuthLock
   */
  private resetForms() {
    this.loginForm.reset({ email: '', password: '' });
    this.registerForm.reset({ email: '', passwords: { password: '', confirmPassword: '' } });
  }
}