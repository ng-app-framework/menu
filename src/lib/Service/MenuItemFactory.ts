import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {MenuItemStructure} from "../Structure/MenuItemStructure";
import {MenuItem} from "./MenuItem";
import {MenuItemAccessHandler} from "./MenuItemAccessHandler";
import {Value} from "@ng-app-framework/core";
import {Name} from "@ng-app-framework/validation";

@Name('MenuItemFactory')
@Injectable()
export class MenuItemFactory {

    menuItems: Array<MenuItem> = [];


    constructor(public accessHandler: MenuItemAccessHandler) {
    }


    createMenuItems(structures: MenuItemStructure[]) {
        return Observable.from(structures)
            .flatMap(child => this.createMenuItem(child));
    }

    createMenuItem(structure: MenuItemStructure): Observable<MenuItem> {
        return this.getMenuItemObservable(new MenuItem(structure))
            .filter(() => this.accessHandler.canAccessLink(structure))
            .flatMap((menuItem) => this.createChildrenIfTheyExist(structure, menuItem));
    }

    createChildrenIfTheyExist(structure: MenuItemStructure, menuItem) {
        if (this.doesStructureHaveChildren(structure)) {
            return this.createChildren(structure.children, menuItem);
        }
        return this.getMenuItemObservable(menuItem);
    }

    doesStructureHaveChildren(structure: MenuItemStructure) {
        return Value.hasArrayElements(structure.children);
    }

    createChildren(structures: MenuItemStructure[], parent: MenuItem): Observable<MenuItem> {
        return this.getMenuItemListIfAnyExist(
            this.mapChildToParent(
                this.createMenuItems(structures),
                parent
            )
        )
            .map((list) => parent);
    }

    mapChildToParent(children$: Observable<MenuItem>, parent: MenuItem) {
        return children$.map((child: MenuItem) => {
            parent.children.push(child);
            child.parent = parent;
            return child;
        });
    }

    getMenuItemListIfAnyExist(menuItems$: Observable<MenuItem>): Observable<MenuItem[]> {
        return menuItems$.toArray()
            .filter(menuItems => Value.hasArrayElements(menuItems));
    }

    getMenuItemObservable(menuItem: MenuItem): Observable<MenuItem> {
        return Observable.from([menuItem]);
    }
}
