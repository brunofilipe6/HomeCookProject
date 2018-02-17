import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GroupModel } from './group.model';
import { NotificationsService } from '../../shared/notifications.service';

@Component({
  selector: 'checkbox-group',
  template:  require('./checkbox-group.html')
})

export class CheckboxGroupComponent {

  /** Groups Recived */
  @Input() groups: GroupModel[];

  /** Group changed */
  @Output() groupUpdated = new EventEmitter();

  /**
   * Function change value of group
   * 
   * @param {any} groupName
   * 
   * @memberOf CheckboxGroupComponent
   */
  updateState(groupName: String){

    var groupClicked: GroupModel;

    let elem = this.groups.find(elem => elem.groupName === groupName);

    /** If take elem, update settings user */
    if(elem) {
      elem.groupActive = !elem.groupActive;
      groupClicked = elem;
      this.groupUpdated.emit({groupUpdated: groupClicked});
    }

  }
}