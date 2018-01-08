import {MenuItem} from "../Service/MenuItem";

export interface MenuItemStructureWithCompiledChildren {
    text?: string | Function;
    link?: string | Function;
    icon?: string;
    children?: MenuItem[];
    enabled?: boolean;
    isOnDashboard?: boolean;
    parent?: MenuItem;
}
