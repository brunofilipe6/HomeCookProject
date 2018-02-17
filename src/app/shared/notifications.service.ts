import * as toastr from 'toastr';

/**
 * Service to notify the user with messages
 * 
 * @export
 * @class NotificationsService
 */
export class NotificationsService {

  constructor() {
    // Put default options here
    toastr.options.preventDuplicates = true;
    // Debug options
    // toastr.options.debug = true;
    // toastr.options.timeOut = 100000;
    // toastr.options.extendedTimeOut = 100000;
    // toastr.success('test', '', {});
    // toastr.error('2test', '', {});
  }

  /**
   * Displays an info message
   * 
   * @param {string} [message='']
   * @param {string} [title='']
   * @param {*} [optionsOverride={}]
   * 
   * @memberOf NotificationsService
   */
  info(message: string = '', title: string = '', optionsOverride: any = {}) {
    toastr.info(message, title, optionsOverride);
  }

  /**
   * Displays a warning message
   * 
   * @param {string} [message='']
   * @param {string} [title='']
   * @param {*} [optionsOverride={}]
   * 
   * @memberOf NotificationsService
   */
  warning(message: string = '', title: string = '', optionsOverride: any = {}) {
    toastr.warning(message, title, optionsOverride);
  }

  /**
   * Displays a success message
   * 
   * @param {string} [message='']
   * @param {string} [title='']
   * @param {*} [optionsOverride={}]
   * 
   * @memberOf NotificationsService
   */
  success(message: string = '', title: string = '', optionsOverride: any = {}) {
    toastr.success(message, title, optionsOverride);
  }

  /**
   * Displays an error message
   * 
   * @param {string} [message='']
   * @param {string} [title='']
   * @param {*} [optionsOverride={}]
   * 
   * @memberOf NotificationsService
   */
  error(message: string = '', title: string = '', optionsOverride: any = {}) {
    toastr.error(message, title, optionsOverride);
  }

  /**
   * Removes current messages without using animation
   * 
   * @memberOf NotificationsService
   */
  remove() {
    toastr.remove();
  }

  /**
   * Removes current messages using animation
   * 
   * @memberOf NotificationsService
   */
  clear() {
    toastr.clear();
  }
}