import {Component, Input, ViewEncapsulation} from '@angular/core';
import {MenuItem} from "../Service/MenuItem";

@Component({
    selector     : 'ng-menu',
    templateUrl  : './menu.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls    : ['./menu.scss']
})
export class MenuComponent {
    @Input() menu: any[];

    @Input() isAvailable: (menuItem: any) => boolean = () => true;

    ngOnInit() {
        console.log(this.menu);
    }
}
