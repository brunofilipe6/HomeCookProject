import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NotificationsService } from '../../shared/notifications.service';
import { StorageService } from '../../shared/storage.service';
import { ValidationService } from '../../shared/validation.service';
import { Settings } from '../shared/settings.model';
import { SettingsService } from '../shared/settings.service';
import { GroupModel } from '../../shared/checkbox-group/group.model';

@Component({
  selector: 'settings',
  template: require('./settings.html')
})

export class SettingsComponent {

  form: FormGroup;

  /** Groups, all groups */
  groups: GroupModel[] = [];

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _storageService: StorageService,
    private _settingsService: SettingsService,
    private _notificationsService: NotificationsService) { }

  ngOnInit() {
    this.initForm();
    this.getSettings();
  }

  /**
   * Initializes the form controls
   * 
   * 
   * @memberOf SettingsComponent
   */
  initForm() {
    this.form = this._formBuilder.group({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      email: new FormControl('', [
        Validators.required,
        ValidationService.emailValidator
      ]),
      passwords: new FormGroup({
        password: new FormControl('', []),
        confirmPassword: new FormControl('', [])
      }, ValidationService.passwordMatchValidator),
      servings: new FormControl('', [
        Validators.required,
        ValidationService.number({ min: 1, max: 9 })
      ]),
      groups: new FormControl('',[
        Validators.required
      ])
    });
  }
  
  /**
   * Get settings and update form controls accordingly
   * 
   * 
   * @memberOf SettingsComponent
   */
  getSettings() {

    /** Get all groups in DataBase */
    this._settingsService.getGroups()
    .then(groups => { 
        this.groups = groups; 
        this._settingsService.getSettings()
        .then(res => {
            this._storageService.settings = res;
            this.form.controls['username'].setValue(this._storageService.settings.username);
            this.form.controls['email'].setValue(this._storageService.settings.email);
            this.form.controls['servings'].setValue(this._storageService.settings.servings);
            
            for ( var i = 0; i < res.groups.length; i++){
              let elem = this.groups.find(group => group.groupId === res.groups[i].groupId);
              if(elem){
                elem.groupActive = !elem.groupActive;
              }
            }
            
            this.form.controls['groups'].setValue(this.groups.filter(function(elem){
                return elem.groupActive === true;
            }));

      })
      .catch(_ => this._notificationsService.error('Não foi possível obter as definições do utilizador!'));
    })
    .catch(_ => this._notificationsService.error('Não foi possível obter os grupos das receitas!'));
    
  }

  /**
   * Save settings accordingly to the form controls
   * 
   * @returns
   * 
   * @memberOf SettingsComponent
   */
  saveSettings() {
    if (!this.form.valid) {
      ValidationService.markControlsAsTouched(this.form);
      return;
    }

    this._settingsService.putSettings({
      username: this.form.controls['username'].value,
      email: this.form.controls['email'].value,
      password: this.form.controls['passwords'].value['password'],
      servings: this.form.controls['servings'].value,
      groups: this.form.controls['groups'].value
    }).then(res => {
      this._storageService.settings = res;
      this._notificationsService.success("O seu Perfil foi atualizado com sucesso!")
    }).catch(error => {
      this._notificationsService.error(error.statusText);
    });
  }

  /**
   * Increase servings by clicking the plus button
   * 
   * 
   * @memberOf SettingsComponent
   */
  increaseServings() {
    this.form.controls['servings'].setValue(this.form.controls['servings'].value + 1);

    // Allow a message error to be shown
    this.form.controls['servings'].markAsTouched();
  }

  /**
   * Decrease servings by clicking the minus button
   * 
   * 
   * @memberOf SettingsComponent
   */
  decreaseServings() {
    this.form.controls['servings'].setValue(this.form.controls['servings'].value - 1);

    // Allow a message error to be shown
    this.form.controls['servings'].markAsTouched();
  }

  /**
   * Cancels the settings form changes and routes back to home
   * 
   * 
   * @memberOf SettingsComponent
   */
  cancel() {
    this._router.navigateByUrl('home');
  }

  /**
   * 
   * 
   * @param {GroupModel} categoryFood
   * 
   * @memberOf SettingsComponent
   */
  updateCategoryFood(categoryFood: GroupModel){

    let elem = this.groups.find(group => group.groupId === categoryFood.groupId);
    if(elem){
        elem.groupActive = !elem.groupActive;
    }

    this.form.controls['groups'].setValue(this.groups.filter(function(elem){
        return elem.groupActive === true;
    }));

  }
  
}