import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Tab } from './tab.interface';
import { TabsComponent } from './tabs.component';

@Component({
  selector: 'tab',
  template: require('./tab.html')
})
export class TabComponent implements Tab, OnInit, OnChanges {
  @Input() id: Number = null;
  @Input() tabTitle: String = "";
  @Input() selected: Boolean = false;
  @Input() hidden: Boolean = false;
  
  constructor(private tabsComponent: TabsComponent) { }
  
  ngOnInit() {
    this.tabsComponent.addTab(this);
  }

  ngOnChanges(changes: SimpleChanges) {
    let hidden = changes['hidden'];
    if(hidden) {
      this.tabsComponent.refreshSelectedTab();
    }
  }
}