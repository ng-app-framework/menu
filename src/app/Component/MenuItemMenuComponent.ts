import {Component, Input, ViewEncapsulation, ViewChild, ElementRef, Inject} from '@angular/core';
import {MenuItem} from "../Service/MenuItem";
import {MenuEvents} from "../Service/MenuEvents";

@Component({
    selector     : '.ng-menu-item-menu',
    templateUrl  : './menu-item-menu.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls    : ['./menu-item.scss']
})
export class MenuItemMenuComponent {

    @ViewChild('children') children: ElementRef;
    @Input() menuItem: MenuItem;

    constructor(@Inject(MenuEvents) public events: MenuEvents) {

    }

    click() {
        this.menuItem.toggle();
    }
}
