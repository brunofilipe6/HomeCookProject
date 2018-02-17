import { Settings } from '../users/shared/settings.model';
import { Role, RoleEnum } from '../users/shared/role.model';

/**
 * Service to storage info across the app 
 * 
 * @export
 * @class StorageService
 */
export class StorageService {
  storage: Storage = localStorage;

  /**
   * Get item facade method
   * 
   * @param {string} key
   * @returns
   * 
   * @memberOf StorageService
   */
  getItem(key: string) {
    return this.storage.getItem(key);
  }

  /**
   * Set item facade method
   * 
   * @param {string} key
   * @param {string} value
   * @returns
   * 
   * @memberOf StorageService
   */
  setItem(key: string, value: string) {
    return this.storage.setItem(key, value);
  }
  
  /**
   * Remove item facade method
   * 
   * @param {string} key
   * 
   * @memberOf StorageService
   */
  removeItem(key: string) {
    this.storage.removeItem(key);
  }

  /**
   * Clear storage facade method
   * 
   * 
   * @memberOf StorageService
   */
  clear() {
    this.storage.clear();
  }

  /**
   * Get token facade property
   * 
   * 
   * @memberOf StorageService
   */
  get token() {
    return this.getItem('id_token');
  }

  /**
   * Set token facade property
   * 
   * 
   * @memberOf StorageService
   */
  set token(value: string) {
    this.setItem('id_token', value);
  }

  /**
   * Get settings facade property
   * 
   * 
   * @memberOf StorageService
   */
  get settings(): Settings {
    let settings: any = this.getItem('settings');
    if(!settings) return null;

    settings = JSON.parse(settings);
    return new Settings(settings.username, settings.email, settings.servings, new Role(settings.role.id, settings.role.name),null);
  }

  /**
   * Set settings facade property
   * 
   * 
   * @memberOf StorageService
   */
  set settings(value: Settings) {
    this.setItem('settings', JSON.stringify(value));
  }
}