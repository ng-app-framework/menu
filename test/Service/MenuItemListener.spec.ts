import {MenuItemListener} from "../../src/lib/Service/MenuItemListener";
import {EventEmitter} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {MenuItem} from "../../src/lib/Service/MenuItem";
import {MenuStructure} from "../../src/lib/Service/MenuStructure";

describe('Module: Menu', () => {
    describe('Class: MenuItemListener', () => {
        let mockMenuItemFactory = <any>{
            menuItems      : [],
            createMenuItems: (menuItems) => {
                return Observable.from([
                    new MenuItem(menuItems[0])
                ]);
            }
        };
        let mockEvents          = <any>{
            onLoadMenu  : new EventEmitter<any>(),
            onMenuLoaded: new EventEmitter<any>()
        };
        let mockMenuItems       = new MenuStructure();
        mockMenuItems.menuItems = [
            {
                text: 'test menuItem'
            }
        ];
        describe('On New Instance', () => {
            it('should be a new MenuItemListener', () => {
                expect(() => {
                    let listener = new MenuItemListener(mockMenuItemFactory, mockEvents);
                    listener.stopListening$.emit();
                }).not.toThrow();
            })
        });

        describe('After Instantiation', () => {
            let listener: MenuItemListener;
            beforeEach(() => {
                listener = new MenuItemListener(mockMenuItemFactory, mockEvents, mockMenuItems);
            });
            afterEach(() => {
                listener.stopListening$.emit();
            });

            describe('Method: Load Menu', () => {
                it('should listen for the event', (done) => {
                    listener.loadMenu = () => {
                        done();
                    };
                    mockEvents.onLoadMenu.emit();
                });
                it('should put the compiled menuItems into the menuItemFactory', (done) => {
                    expect(mockMenuItemFactory.menuItems.length).toEqual(0);
                    mockEvents.onMenuLoaded.first().subscribe(() => {
                        expect(mockMenuItemFactory.menuItems.length).toEqual(1);
                        expect(mockMenuItemFactory.menuItems[0].text).toEqual('test menuItem');
                        done();
                    });
                    listener.loadMenu();
                });
                it('should wipe the menuItems before it compiles the menuItems again', (done) => {
                    mockMenuItemFactory.menuItems = [
                        new MenuItem({}), new MenuItem({})
                    ];
                    expect(mockMenuItemFactory.menuItems.length).toEqual(2);
                    mockEvents.onMenuLoaded.first().subscribe(() => {
                        expect(mockMenuItemFactory.menuItems.length).toEqual(1);
                        expect(mockMenuItemFactory.menuItems[0].text).toEqual('test menuItem');
                        done();
                    });
                    listener.loadMenu();
                })
            });
        });
    });
});
