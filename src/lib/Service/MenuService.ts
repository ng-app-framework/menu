import {EventEmitter, Injectable} from "@angular/core";

@Injectable()
export class MenuService {

    toggle: EventEmitter<string> = new EventEmitter<string>();
}
