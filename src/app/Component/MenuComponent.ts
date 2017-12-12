import {Component, Input, ViewEncapsulation} from '@angular/core';
import {MenuItem} from "../Service/MenuItem";

@Component({
    selector     : '.ng-menu',
    templateUrl  : './menu.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls    : ['./menu.scss']
})
export class MenuComponent {

    @Input()
    menuItems: MenuItem[] = [];

}
