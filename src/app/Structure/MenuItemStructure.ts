import {MenuItem} from "../Service/MenuItem";

export interface MenuItemStructure {
    text?: string | Function;
    link?: string;
    icon?: string;
    parent?: MenuItem;
    children?: MenuItem[] | MenuItemStructure[];
    requiredPermissions?: string[];
    isOnDashboard?: boolean;
}
