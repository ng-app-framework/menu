import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
    selector     : 'ng-menu-item-label',
    template: `<ng-content></ng-content>`,
    encapsulation: ViewEncapsulation.None
})
export class MenuItemLabelComponent {

}
