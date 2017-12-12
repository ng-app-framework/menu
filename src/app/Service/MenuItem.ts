import {MenuItemStructureWithCompiledChildren} from "../Structure/MenuItemStructureWithCompiledChildren";
import {MenuItemStructure} from "../Structure/MenuItemStructure";
import {ObjectCombiner, Value} from "@ng-app-framework/core";

export class MenuItem implements MenuItemStructureWithCompiledChildren {

    text: any              = '';
    link: string           = 'javascript:';
    icon: string           = '';
    children: MenuItem[]   = [];
    enabled: boolean       = true;
    isOnDashboard: boolean = false;
    parent: MenuItem       = null;
    height: number         = 0;

    isOpen: boolean              = false;
    hasBeenOpenedBefore: boolean = false;

    constructor(structure: MenuItemStructure) {
        ObjectCombiner.combine(this, structure, ['children']);
    }

    getText() {
        if (Value.isTypeOf(Function, this.text)) {
            return this.text();
        }
        return this.text;
    }


    hasChildren() {
        return Value.hasArrayElements(this.children);
    }

    toggle() {
        this.isOpen              = !this.isOpen;
        this.hasBeenOpenedBefore = true;
    }
}
