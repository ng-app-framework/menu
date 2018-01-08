import {MenuItem} from "../../src/lib/Service/MenuItem";

describe('Module: Menu', () => {
    describe('Class: MenuItem', () => {
        describe('On New Instance', () => {
            describe('No overrides are provided', () => {
                it('should contain the default values', () => {
                    let menuItem = new MenuItem({});
                    expect(menuItem.text).toEqual('');
                    expect(menuItem.link).toEqual('javascript:');
                    expect(menuItem.icon).toEqual('');
                    expect(menuItem.children).toEqual([]);
                    expect(menuItem.enabled).toBeTruthy();
                    expect(menuItem.isOnDashboard).toBeFalsy();
                    expect(menuItem.parent).toBeNull();
                    expect(menuItem.height).toEqual(0);
                    expect(menuItem.isOpen).toBeFalsy();
                    expect(menuItem.hasBeenOpenedBefore).toBeFalsy();
                });
                it('should overwrite default values if provided', () => {

                    let menuItem = new MenuItem({
                        text         : 'test menuItem',
                        link         : '/test/url',
                        isOnDashboard: true
                    });
                    expect(menuItem.text).toEqual('test menuItem');
                    expect(menuItem.link).toEqual('/test/url');
                    expect(menuItem.icon).toEqual('');
                    expect(menuItem.children).toEqual([]);
                    expect(menuItem.enabled).toBeTruthy();
                    expect(menuItem.isOnDashboard).toBeTruthy();
                    expect(menuItem.parent).toBeNull();
                    expect(menuItem.height).toEqual(0);
                    expect(menuItem.isOpen).toBeFalsy();
                    expect(menuItem.hasBeenOpenedBefore).toBeFalsy();
                })
            });
        });
        describe('After Instantiation', () => {
            let menuItem: MenuItem;
            beforeEach(() => {
                menuItem = new MenuItem({});
            });

            describe('Method: Get Text', () => {
                describe('Text is a String', () => {
                    it('should just return the string value', () => {
                        menuItem.text = 'test text!';
                        expect(menuItem.getText()).toEqual(menuItem.text);
                    });
                });
                describe('Text is a Function', () => {
                    it('should execute the function', () => {
                        let text      = 'the function call worked.';
                        menuItem.text = () => {
                            return text;
                        };
                        expect(menuItem.getText()).toEqual(text);
                    });
                });
            });
            describe('Method: Has Children', () => {
                it('should return whether the menu item has children', () => {
                    expect(menuItem.hasChildren()).toBeFalsy();
                    menuItem.children.push(new MenuItem({parent: menuItem}));
                    expect(menuItem.hasChildren()).toBeTruthy();
                })
            });
            describe('Method: Toggle', () => {
                it('should set the isOpen property to the opposite of the previous value', () => {
                    expect(menuItem.isOpen).toBeFalsy();
                    menuItem.toggle();
                    expect(menuItem.isOpen).toBeTruthy();
                    menuItem.toggle();
                    expect(menuItem.isOpen).toBeFalsy();
                });
                it('should always set the hasBeenOpenedBefore property to true', () => {
                    expect(menuItem.hasBeenOpenedBefore).toBeFalsy();
                    menuItem.toggle();
                    expect(menuItem.hasBeenOpenedBefore).toBeTruthy();
                    menuItem.toggle();
                    expect(menuItem.hasBeenOpenedBefore).toBeTruthy();
                });
            });
        });
    });
});
