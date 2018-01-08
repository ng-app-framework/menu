import {Component, ElementRef, EventEmitter, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import {Router} from "@angular/router";
import {MenuService} from "../Service/MenuService";

@Component({
    selector     : 'ng-menu-item',
    templateUrl  : './menu-item.html',
    encapsulation: ViewEncapsulation.None
})
export class MenuItemComponent {

    @Input() icon: string     = '';
    @Input() enabled: boolean = true;
    @Input() link: string     = '';

    @ViewChild('childMenu') childMenu: ElementRef;

    open = false;

    identifier = `menu-item${identifier++}`;

    onDestroy$ = new EventEmitter<any>();

    constructor(public router: Router, public menuService: MenuService) {

    }

    ngOnInit() {
        this.menuService.toggle.takeUntil(this.onDestroy$)
            .subscribe(value => {
                if (value === this.identifier) {
                    this.open = !this.open;
                    return;
                }
            });
    }

    ngOnDestroy() {
        this.onDestroy$.emit();
    }

    hasChildren() {
        return this.childMenu && this.childMenu.nativeElement.children.length > 0
    }
}

let identifier = 0;
