import {MenuItemFactory} from "../../src/app/Service/MenuItemFactory";
import {MenuItem} from "../../src/app/Service/MenuItem";
import {Observable} from "rxjs/Rx";

describe('Module: Menu', () => {
    describe('Class: MenuItemFactory', () => {
        let mockAccessHandler = <any>{
            canAccessLink: () => {
                return true;
            }
        };
        describe('On New Instance', () => {
            it('should be a new MenuItemFactory', () => {
                expect(() => new MenuItemFactory(mockAccessHandler)).not.toThrow();
            });
        });
        describe('After Instantiation', () => {
            let factory: MenuItemFactory;
            beforeEach(() => {
                factory = new MenuItemFactory(mockAccessHandler);
            });

            describe('Method: Does Structure Have Children', () => {
                it('should properly check if a menu item should have children', () => {
                    expect(factory.doesStructureHaveChildren({})).toBeFalsy('Empty Structure');
                    expect(factory.doesStructureHaveChildren({children: null})).toBeFalsy('Null Children');
                    expect(factory.doesStructureHaveChildren({children: []})).toBeFalsy('Empty Children Array');
                    expect(factory.doesStructureHaveChildren({children: [{}]})).toBeTruthy('Has Children');
                })
            });

            describe('Method: Create Menu Item', () => {
                let getNewMenuItemObservable = function (structure) {
                    return factory.createMenuItem(structure);
                };
                it('should provide a menu item in an observable', (done) => {
                    let called = false;
                    getNewMenuItemObservable({
                        text: 'example menu item',
                        link: '/example/link'
                    }).toArray().subscribe({
                        next    : (menuItems: MenuItem[]) => {
                            expect(menuItems.length).toEqual(1);
                            expect(menuItems[0] instanceof MenuItem).toBeTruthy();
                            called = true;
                        },
                        error   : () => {
                            throw "Observable erred out!";
                        },
                        complete: () => {
                            if (!called) {
                                throw "No MenuItems were returned!";
                            }
                            done();
                        }
                    })
                });
            });

            describe('Method: Get Menu Item List If Any Exist', () => {
                it('should return an observable of an array of menu items', (done) => {
                    let result = [];
                    let list   = [new MenuItem({})];
                    factory.getMenuItemListIfAnyExist(
                        Observable.from(list)
                    ).subscribe({
                        next    : (menuItems) => {
                            expect(menuItems.length).toEqual(1);
                            result = menuItems;
                        },
                        error   : () => {
                            throw "Should have not erred";
                        },
                        complete: () => {
                            expect(result).toEqual(list);
                            done();
                        }
                    });
                });
                it('should not return an array if the array is empty', (done) => {
                    factory.getMenuItemListIfAnyExist(
                        Observable.from([])
                    ).subscribe({
                        next    : (menuItems) => {
                            throw "Should not have returned any values";
                        },
                        error   : () => {
                            throw "Should have not erred";
                        },
                        complete: () => {
                            done();
                        }
                    });
                });
            });
            describe('Method: Map Child To Parent', () => {
                it('should set the parent to the children, and should set the children to the menu items', (done) => {
                    let children = [new MenuItem({})];
                    let parent   = new MenuItem({});
                    factory.mapChildToParent(Observable.from(children), parent)
                        .subscribe({
                            next    : (child) => {
                                expect(child.parent).toBe(parent);
                            },
                            error   : () => {
                                throw "Should not have erred";
                            },
                            complete: () => {
                                expect(parent.children).toEqual(children);
                                done();
                            }
                        });
                });
            });
            describe('Method: Create Menu Items', () => {
                it('should return menuItem objects for multiple structures', (done) => {
                    let structures = [
                        {
                            text: 'Object 1'
                        },
                        {
                            text: 'Object 2'
                        }
                    ];
                    factory.createMenuItems(structures)
                        .toArray()
                        .subscribe({
                            next    : (menuItems) => {
                                if (menuItems.length !== 2) {
                                    throw "2 MenuItems were not created!";
                                }
                                if (!(menuItems[0] instanceof MenuItem) || !(menuItems[1] instanceof MenuItem)) {
                                    throw "It did NOT create menu items!";
                                }
                            },
                            complete: () => done()
                        })
                });
            });
            describe('Method: Create Children', () => {
                let structures = [
                    {
                        text: 'child 1'
                    },
                    {
                        text    : 'child 2',
                        children: [
                            {
                                text: 'child 3'
                            }
                        ]
                    }
                ];
                let parent: MenuItem;

                beforeEach(() => {
                    parent = new MenuItem({
                        text: 'parent'
                    });
                });

                function createChildren(onNext: Function, doneCallback: Function) {
                    factory.createChildren(structures, parent)
                        .subscribe({
                            next    : (menuItem) => {
                                onNext(menuItem);
                            },
                            complete: () => doneCallback()
                        });
                }

                it('should return the parent', (done) => {
                    createChildren((menuItem) => {
                        expect(menuItem).toBe(parent);
                    }, done);
                });
                it('should contain 2 children', (done) => {
                    createChildren((menuItem) => {
                        expect(menuItem.children.length).toEqual(2);
                        expect(menuItem.children[0] instanceof MenuItem).toBeTruthy();
                        expect(menuItem.children[0].text).toEqual('child 1');
                        expect(menuItem.children[1] instanceof MenuItem).toBeTruthy();
                        expect(menuItem.children[1].text).toEqual('child 2');
                    }, done);
                });
                it('should contain the second child\'s child', (done) => {
                    createChildren((menuItem) => {
                        expect(menuItem.children[1].children.length).toEqual(1);
                        expect(menuItem.children[1].children[0] instanceof MenuItem).toBeTruthy();
                        expect(menuItem.children[1].children[0].text).toEqual('child 3');
                    }, done);
                });
            });
        });
    });
});
