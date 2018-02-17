import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import { HttpManager } from '../../shared/http.manager';
import { StorageService } from '../../shared/storage.service';
import { Settings } from './settings.model';
import { Role, RoleEnum } from './role.model';

import { GroupModel } from '../../shared/checkbox-group/group.model';

@Injectable()
export class SettingsService {
  httpManager: HttpManager;
  apiUrl_users = 'users/settings';
  apiUrl_groups: String = 'groups';

  constructor(private _httpManager: HttpManager, private _storageService: StorageService) { }

  getSettings(): Promise<Settings> {
    return this._httpManager.getAll(this.apiUrl_users)
      .map((res: any) => new Settings(
            res.username, 
            res.email, 
            res.servings,
            new Role(res.role.id, res.role.role),
            this.formatGroups(res.groups))
        )
      .toPromise();
  }

  putSettings(userSettings): Promise<Settings> {
    return this._httpManager.putAll(this.apiUrl_users, userSettings)
      .map((res: any) => new Settings(
            res.username, 
            res.email, 
            res.servings, 
            new Role(res.role.id, res.role.role),
            res.groups)
      )
      .toPromise();
  }

  private formatGroups(res: any[]): GroupModel[] {
    var groups: GroupModel[] = [];
    for( var i = 0; i < res.length; i++){ 
      groups.push(new GroupModel(res[i].groupId,res[i].groupName,true));
    }
    return groups;
  }

  /**
   * Gets recipes based on passed parameters
   * 
   * @param {any} [{search = '', isNovelty = false, isFavorite = false, rating = '', price = '', time = ''}={}]
   * @returns {Promise<RecipeModel[]>}
   * 
   * @memberOf RecipeService
   */
  getGroups(): Promise<GroupModel[]> {
    return this._httpManager.getAll(this.apiUrl_groups).map(this.listOfGroups)
      .toPromise();
  }
  
  /**
   * Map groups, all groups returned
   * 
   * @private
   * @param {*} list
   * @returns {GroupModel[]}
   * 
   * @memberOf GroupService
   */
  private listOfGroups(list: any): GroupModel[] {
    return list.map(group => {
      return new GroupModel(
        group.id,
        group.name,
        false);
    });
  }
  
}