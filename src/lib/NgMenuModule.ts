import {ModuleWithProviders, NgModule} from '@angular/core';
import {MenuComponent} from "./Component/MenuComponent";
import {MenuItemLabelComponent} from "./Component/MenuItemLabelComponent";
import {MenuItemFactory} from "./Service/MenuItemFactory";
import {MenuItemComponent} from "./Component/MenuItemComponent";
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
import {MenuService} from './Service/MenuService';

@NgModule({
    declarations: [
        MenuComponent,
        MenuItemComponent,
        MenuItemLabelComponent
    ],
    imports     : [
        CommonModule,
        NgCoreModule,
        NgSafeModule,
        NgFeatureModule,
        NgAccessModule,
        NgSessionModule,
        RouterModule,
        TooltipModule.forRoot()
    ],
    exports     : [
        MenuComponent,
        MenuItemComponent,
        MenuItemLabelComponent
    ],
    providers   : [
        MenuItemFactory,
        MenuItemListener,
        MenuEvents,
        MenuItemAccessHandler,
        MenuService
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
