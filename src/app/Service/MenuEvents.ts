import {EventEmitter} from "@angular/core";

export class MenuEvents {

    /* istanbul ignore next */
    onLoadMenu: EventEmitter<any>   = new EventEmitter<any>();
    /* istanbul ignore next */
    onMenuLoaded: EventEmitter<any> = new EventEmitter<any>();
}
