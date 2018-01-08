import {MenuItemAccessHandler} from "../../src/lib/Service/MenuItemAccessHandler";
import {MenuItemStructure} from "../../src/lib/Structure/MenuItemStructure";
import {Roles} from "@ng-app-framework/access";

describe('Module: Menu', () => {
    describe('Class: MenuItemAccessHandler', () => {
        let mockFeatures         = <any>{
            shouldBeEnabled: true,
            isRouteEnabled : (route: string) => {
                return mockFeatures.shouldBeEnabled;
            }
        };
        let mockRole             = {
            shouldBeAuthorized    : true,
            isAuthorizedForActions: (actions: string[]) => {
                return mockRole.shouldBeAuthorized;
            }
        };
        let mockSessionState          = <any>{
                role: Roles.MEMBER
        };
        let mockAccessController = <any>{
            getRole: (role: string) => {
                return mockRole;
            }
        };

        describe('On New Instance', () => {
            it('should be a new MenuItemAccessHandler', () => {
                expect(() => new MenuItemAccessHandler(mockFeatures, mockSessionState, mockAccessController)).not.toThrow();
            })
        });
        describe('After Instantiation', () => {
            let accessHandler: MenuItemAccessHandler;

            beforeEach(() => {
                accessHandler                = new MenuItemAccessHandler(mockFeatures, mockSessionState, mockAccessController);
                mockFeatures.shouldBeEnabled = true;
                mockSessionState.role       = Roles.MEMBER;
                mockRole.shouldBeAuthorized  = true;
            });

            describe('Method: Does MenuItem Have Required Permissions', () => {
                it('should return whether the menu item has required permissions', () => {
                    expect(
                        accessHandler.doesMenuItemHaveRequiredPermissions({})
                    ).toBeFalsy();
                    expect(
                        accessHandler.doesMenuItemHaveRequiredPermissions({
                            requiredPermissions: null
                        })
                    ).toBeFalsy();
                    expect(
                        accessHandler.doesMenuItemHaveRequiredPermissions({
                            requiredPermissions: []
                        })
                    ).toBeFalsy();
                    expect(
                        accessHandler.doesMenuItemHaveRequiredPermissions({
                            requiredPermissions: ['permission']
                        })
                    ).toBeTruthy();
                });
            });
            describe('Method: Is Route Enabled', () => {
                it('should decide on whether a route is enabled by the features or if a user is an admin', () => {
                    expect(accessHandler.isRouteEnabled('/test/url')).toBeTruthy();
                    mockFeatures.shouldBeEnabled = false;
                    expect(accessHandler.isRouteEnabled('/test/url')).toBeFalsy();
                    mockSessionState.role = Roles.ADMIN;
                    expect(accessHandler.isRouteEnabled('/test/url')).toBeTruthy();
                })
            });

            describe('Method: Does User Have Access', () => {

                describe('No', () => {

                    let assertUserDoesNotHaveAccess = function (permissions: string[] = []) {
                        expect(accessHandler.doesUserHaveAccess({
                            requiredPermissions: permissions
                        })).toBeFalsy();
                    };
                    it('permissions are provided and the role is not authorized', () => {
                        mockRole.shouldBeAuthorized = false;
                        assertUserDoesNotHaveAccess(['testPermission']);
                    });
                });
                describe('Yes', () => {
                    let assertUserHasAccess = function (permissions: string[] = []) {
                        expect(accessHandler.doesUserHaveAccess({
                            requiredPermissions: permissions
                        })).toBeTruthy();
                    };
                    it('no permissions are required even if role is not authorized', () => {
                        mockRole.shouldBeAuthorized = true;
                        assertUserHasAccess();
                        mockRole.shouldBeAuthorized = false;
                        assertUserHasAccess();
                    });
                    it('a role is authorized for the permissions', () => {
                        mockRole.shouldBeAuthorized = true;
                        assertUserHasAccess(['testPermission']);
                    });
                });
            });

            describe('Method: Can Access Link', () => {
                let shouldHavePermission = false;
                let isRouteEnabled       = false;
                beforeEach(() => {
                    shouldHavePermission             = false;
                    isRouteEnabled                   = false;
                    accessHandler.isRouteEnabled     = (link: string) => {
                        return isRouteEnabled;
                    };
                    accessHandler.doesUserHaveAccess = (menuItem: MenuItemStructure) => {
                        return shouldHavePermission;
                    };
                });


                describe('No', () => {
                    let assertLinkInaccessible = function () {
                        expect(accessHandler.canAccessLink({
                            link: '/test/url'
                        })).toBeFalsy();
                    };
                    it('the route is not enabled and role is unauthorized', () => {
                        shouldHavePermission = false;
                        isRouteEnabled       = false;
                        assertLinkInaccessible();
                    });
                    it('the role is authorized but route is not enabled', () => {
                        shouldHavePermission = true;
                        isRouteEnabled       = false;
                        assertLinkInaccessible();
                    });
                    it('the role is unauthorized but route is enabled', () => {
                        shouldHavePermission = false;
                        isRouteEnabled       = true;
                        assertLinkInaccessible();
                    });
                });
                describe('Yes', () => {
                    let assertLinkAccessible = function () {
                        expect(accessHandler.canAccessLink({
                            link: '/test/url'
                        })).toBeTruthy();
                    };
                    it('the route is not provided', () => {
                        expect(() => {
                            accessHandler.canAccessLink({
                                link: null
                            });
                        }).not.toThrow();
                        expect(accessHandler.canAccessLink({
                            link: null
                        })).toBeTruthy();
                    });

                    it('the role is authorized AND the route is enabled', () => {
                        shouldHavePermission = true;
                        isRouteEnabled       = true;
                        assertLinkAccessible();
                    });
                });

            });
        });
    });
});
