import {Component, Input, ViewEncapsulation} from '@angular/core';
import {MenuItem} from "../Service/MenuItem";
import {Features} from "@ng-app-framework/feature";
import {Session} from "@ng-app-framework/session";
import {Roles, SessionStateWithRole} from "@ng-app-framework/access";

@Component({
    selector     : '.ng-menu-item-body',
    templateUrl  : './menu-item-body.html',
    encapsulation: ViewEncapsulation.None
})
export class MenuItemBodyComponent {

    @Input()
    menuItem: MenuItem;

    constructor(public features: Features, public session: Session, public sessionState: SessionStateWithRole) {

    }

    showCaution() {
        return this.sessionState.role === Roles.ADMIN && !this.features.isRouteEnabled(this.menuItem.link);
    }
}
