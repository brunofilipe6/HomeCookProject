import { Component, EventEmitter, Output } from '@angular/core';
import { Tab } from './tab.interface';

@Component({
  selector: 'tabs',
  template: require('./tabs.html')
})
export class TabsComponent {
  tabs: Tab[] = [];
  @Output() selected = new EventEmitter();

  /**
   * The first tab to be displayed is the first non hidden tab
   * 
   * @param {Tab} tab
   * 
   * @memberOf TabsComponent
   */
  addTab(tab: Tab) {
    let displayedTab = this.tabs.find(tab => tab.hidden == false);

    if (!displayedTab && !tab.hidden) {
      tab.selected = true;
    }
    
    this.tabs.push(tab);
  }

  /**
   * Selected a tab and emits an event
   * 
   * @param {Tab} tab
   * 
   * @memberOf TabsComponent
   */
  selectTab(tab: Tab) {
    this.resetSelectedTab();

    tab.selected = true;
    this.selected.emit({ selectedTab: tab });
  }

  selectedTab() {
    return this.tabs.find(tab => tab.selected == true);
  }

  resetSelectedTab() {
    this.tabs.forEach(tab => {
      tab.selected = false;
    });
  }

  refreshSelectedTab() {
    this.resetSelectedTab();

    let tabToSelect = this.tabs.find(tab => tab.hidden == false);
    if (tabToSelect) {
      tabToSelect.selected = true;
      this.selected.emit({ selectedTab: tabToSelect });
    }
  }
}