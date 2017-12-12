import {Component, Input, ViewEncapsulation} from '@angular/core';
import {MenuItem} from "../Service/MenuItem";
import {Router} from "@angular/router";

@Component({
    selector     : '.ng-menu-item',
    templateUrl  : './menu-item.html',
    encapsulation: ViewEncapsulation.None
})
export class MenuItemComponent {

    @Input() menuItem: MenuItem;

    constructor(public router: Router) {

    }
}
