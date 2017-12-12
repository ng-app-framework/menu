import {ModuleWithProviders, NgModule} from '@angular/core';
import {MenuComponent} from "./Component/MenuComponent";
import {MenuItemMenuComponent} from "./Component/MenuItemMenuComponent";
import {MenuItemFactory} from "./Service/MenuItemFactory";
import {MenuItemComponent} from "./Component/MenuItemComponent";
import {MenuItemBodyComponent} from "./Component/MenuItemBodyComponent";
import {NavigationEnd, Router, RouterModule} from "@angular/router";
import {MenuItemListener} from "./Service/MenuItemListener";
import {MenuItemStructure} from "./Structure/MenuItemStructure";
import {MenuEvents} from "./Service/MenuEvents";
import {MenuItemAccessHandler} from "./Service/MenuItemAccessHandler";
import {MenuStructure} from "./Service/MenuStructure";
import {TooltipModule} from "ngx-bootstrap";
import {NgFeatureModule} from "@ng-app-framework/feature";
import {NgAccessModule} from "@ng-app-framework/access";
import {NgCoreModule} from "@ng-app-framework/core";
import {CommonModule} from "@angular/common";
import {NgSessionModule} from "@ng-app-framework/session";
import {NgSafeModule} from "@ng-app-framework/safe";

@NgModule({
    declarations: [
        MenuComponent,
        MenuItemComponent,
        MenuItemMenuComponent,
        MenuItemBodyComponent
    ],
    imports     : [
        CommonModule,
        NgCoreModule,
        NgSafeModule,
        NgFeatureModule,
        NgAccessModule,
        NgSessionModule,
        RouterModule,
        TooltipModule
    ],
    exports     : [
        MenuComponent
    ],
    providers   : [
        MenuItemFactory,
        MenuItemListener,
        MenuEvents,
        MenuItemAccessHandler
    ]
})
export class NgMenuModule {

    constructor(listener: MenuItemListener, router: Router, events: MenuEvents) {

        router.routeReuseStrategy.shouldReuseRoute = () => false;
        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                router.navigated = false;
                window.scrollTo(0, 0);
            }
        });
    }

    static forRoot(menuStructure: MenuItemStructure[]): ModuleWithProviders {
        return {
            ngModule : NgMenuModule,
            providers: [
                {
                    provide : MenuStructure,
                    useValue: {menuItems: menuStructure}
                }
            ]
        };
    }
}
