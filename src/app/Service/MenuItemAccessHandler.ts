import {Inject, Injectable} from "@angular/core";
import {MenuItemStructure} from "../Structure/MenuItemStructure";
import {Value} from "@ng-app-framework/core";
import {Features} from "@ng-app-framework/feature";
import {AccessController, Roles, SessionStateWithRole} from "@ng-app-framework/access";

@Injectable()
export class MenuItemAccessHandler {
    constructor(@Inject(Features) public features: Features,
                @Inject(SessionStateWithRole) public sessionState: SessionStateWithRole,
                @Inject(AccessController) public accessController: AccessController) {
    }

    canAccessLink(menuItem: MenuItemStructure): boolean {
        return !Value.isProvided(menuItem.link) || (this.isRouteEnabled(menuItem.link) && this.doesUserHaveAccess(menuItem));
    }

    doesUserHaveAccess(menuItem: MenuItemStructure) {
        if (this.doesMenuItemHaveRequiredPermissions(menuItem)) {
            return this.accessController.getRole(this.sessionState.role).isAuthorizedForActions(menuItem.requiredPermissions);
        }
        return true;
    }

    doesMenuItemHaveRequiredPermissions(menuItem: MenuItemStructure) {
        return Value.hasArrayElements(menuItem.requiredPermissions);
    }

    isRouteEnabled(route: string = '') {
        return this.sessionState.role === Roles.ADMIN
            || this.features.isRouteEnabled(route);
    }
}
