import {MenuItemFactory} from "./MenuItemFactory";
import {EventEmitter, Injectable, Optional} from "@angular/core";
import {MenuEvents} from "./MenuEvents";
import {MenuStructure} from "./MenuStructure";
import {UnsubscribeAll} from "@ng-app-framework/core";
import {Observable} from "rxjs/Rx";
import {MenuItem} from "./MenuItem";

@Injectable()
export class MenuItemListener {

    stopListening$ = new EventEmitter<any>();

    constructor(public menuItemFactory: MenuItemFactory,
                public events: MenuEvents,
                @Optional() public menuStructure: MenuStructure = {menuItems: []}) {
        this.listen();
    }

    listen() {
        this.events.onLoadMenu.takeUntil(UnsubscribeAll.merge(this.stopListening$))
            .subscribe(() => this.loadMenu());
    }

    loadMenu(): void {
        this.createMenuItems$().subscribe({
            next    : (menuItem: MenuItem) => {
                this.menuItemFactory.menuItems.push(menuItem);
            },
            complete: () => this.events.onMenuLoaded.emit()
        });
    }

    createMenuItems$(): Observable<MenuItem> {
        this.clearMenuItems();
        return this.menuItemFactory.createMenuItems(this.menuStructure.menuItems);
    }

    clearMenuItems() {
        this.menuItemFactory.menuItems.splice(0, this.menuItemFactory.menuItems.length);
    }
}
