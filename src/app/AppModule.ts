import {Component, NgModule, ViewEncapsulation} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {Value} from "@ng-app-framework/core";
import {Features} from "@ng-app-framework/feature";
import {Session, SessionState} from "@ng-app-framework/session";
import {NgMenuModule} from "../lib/NgMenuModule";
import {MenuEvents} from "../lib/Service/MenuEvents";
import {MenuItemFactory} from "../lib/Service/MenuItemFactory";
import {RouterModule} from "@angular/router";
import {AccessController, Roles, SessionStateWithRole} from "@ng-app-framework/access";
import {MenuItemStructure} from "../lib/Structure/MenuItemStructure";

@Component({
    selector     : 'app',
    encapsulation: ViewEncapsulation.None,
    template     : `
        <div class="menu-container">
            <ng-menu [menu]="menu" [isAvailable]="isAvailable">
            </ng-menu>
        </div>
        <div class="page-body">
            <div class="container-fluid">
                <h3>Menu Component</h3>
                <h4>Importing</h4>
                <p>Use the forRoot method on the NgMenuModule</p>
                <pre>{{includeCode}}</pre>
                <h4>CSS/JS Requirements</h4>
                <p>Include appropriate styles and scripts (example from angular cli)</p>
                <pre>{{stylesAndScripts}}</pre>
                <h4>Populating the Menu</h4>
                <p>Use the MenuEvents class and MenuItemFactory class to trigger the menu
                    formatting and to retrieve the menu for the component</p>
                <pre>{{componentCode}}</pre>
                <h4>Displaying the Menu</h4>
                <pre>{{markup}}</pre>
            </div>
        </div>
    `,
    styleUrls    : ['../../public/demo-styles.scss']
})
export class AppComponent {

    markup           = `
<div class="ng-menu" [menuItems]="menuItemFactory.menuItems"></div>`;
    stylesAndScripts = `
    
      "styles": [
        "node_modules/font-awesome/css/font-awesome.css",
        "node_modules/tether/dist/css/tether.min.css",
        "node_modules/bootstrap/dist/css/bootstrap.css"
      ],
      "scripts": [
        "node_modules/jquery/dist/jquery.min.js",
        "node_modules/tether/dist/js/tether.min.js",
        "node_modules/popper.js/dist/umd/popper.min.js",
        "node_modules/bootstrap/dist/js/bootstrap.js"
      ]
    
    `;
    includeCode      = `
NgMenuModule.forRoot([
    {
        text: 'Home',
        icon: 'home',
        link: '/'
    },
    {
        text    : 'Menu',
        icon    : 'bars',
        children: [
            {
                text               : 'Somewhere',
                icon               : 'flag',
                link               : '/somewhere',
                requiredPermissions: ['random-permission']
            },
            {
                text               : 'Protected Somewhere',
                icon               : 'flag',
                link               : '/somewhere-2',
                requiredPermissions: ['other-permission']
            }
        ]
    }
])
    `;

    menu = [
        {
            text: 'The <b>Menu</b> is Below!'
        },
        {
            text: 'Home',
            icon: 'home',
            link: '/'
        },
        {
            text    : 'Menu',
            icon    : 'bars',
            children: [
                {
                    text               : 'Somewhere',
                    icon               : 'flag',
                    link               : '/somewhere',
                    requiredPermissions: ['random-permission']
                },
                {
                    text               : 'Protected Somewhere',
                    icon               : 'flag',
                    link               : '/somewhere-2',
                    requiredPermissions: ['other-permission']
                }
            ]
        }
    ];

    componentCode = `
constructor(public events: MenuEvents, public menuItemFactory: MenuItemFactory) {
}
ngOnInit() {
    this.events.onLoadMenu.emit();
}
    `;

    constructor(public sessionState:SessionStateWithRole, public accessController: AccessController, public features: Features) {
    }

    isAvailable = (menuItem:any) => {
        return this.canAccessLink(menuItem);
    };

    doesUserHaveAccess(menuItem: MenuItemStructure) {
        if (this.doesMenuItemHaveRequiredPermissions(menuItem)) {
            return this.accessController.getRole(this.sessionState.role).isAuthorizedForActions(menuItem.requiredPermissions);
        }
        return true;
    }

    doesMenuItemHaveRequiredPermissions(menuItem: MenuItemStructure) {
        return Value.hasArrayElements(menuItem.requiredPermissions);
    }

    canAccessLink(menuItem: any): boolean {
        return !Value.isProvided(menuItem.link) || (this.isRouteEnabled(menuItem.link) && this.doesUserHaveAccess(menuItem));
    }
    isRouteEnabled(route: string = '') {
        return this.sessionState.role === Roles.ADMIN
            || this.features.isRouteEnabled(route);
    }

}

@NgModule({
    declarations: [AppComponent],
    imports     : [
        BrowserModule,
        CommonModule,
        RouterModule.forRoot([

            {
                path     : '',
                component: AppComponent
            },
            {
                path     : 'somewhere',
                component: AppComponent
            }
        ]),
        NgMenuModule.forRoot([
            {
                text: 'The <b>Menu</b> is Below!'
            },
            {
                text: 'Home',
                icon: 'home',
                link: '/'
            },
            {
                text    : 'Menu',
                icon    : 'bars',
                children: [
                    {
                        text               : 'Somewhere',
                        icon               : 'flag',
                        link               : '/somewhere',
                        requiredPermissions: ['random-permission']
                    },
                    {
                        text               : 'Protected Somewhere',
                        icon               : 'flag',
                        link               : '/somewhere-2',
                        requiredPermissions: ['other-permission']
                    }
                ]
            }
        ])
    ],
    exports     : [AppComponent],
    providers   : [],
    bootstrap   : [AppComponent]

})
export class AppModule {

    constructor() {
        let role = (new AccessController()).createRole(Roles.GUEST);
        role.setPermission('random-permission', true);
        role.setPermission('other-permission', false);
    }
}
