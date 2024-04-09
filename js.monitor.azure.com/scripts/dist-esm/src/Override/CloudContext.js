/*
 * 1DS JS SDK Shared Analytics, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
import {
    __extendsFn as __extends
} from "@microsoft/applicationinsights-shims";
/**
 * CloudContext.ts
 * @copyright Microsoft 2020
 */
import {
    CloudExtKeys
} from "@microsoft/1ds-properties-js";
import {
    BaseContext
} from "./BaseContext";
var CloudContext = /** @class */ (function(_super) {
    __extends(CloudContext, _super);

    function CloudContext(container) {
        var _this = _super.call(this, container) || this;
        var _self = _this;
        _self.setRole = function(role) {
            _self._setOverride(CloudExtKeys.role, role);
        };
        _self.getRole = function() {
            return _self._getOverride(CloudExtKeys.role);
        };
        _self.setRoleInstance = function(roleInstance) {
            _self._setOverride(CloudExtKeys.roleInstance, roleInstance);
        };
        _self.getRoleInstance = function() {
            return _self._getOverride(CloudExtKeys.roleInstance);
        };
        _self.setRoleVer = function(roleVer) {
            _self._setOverride(CloudExtKeys.roleVer, roleVer);
        };
        _self.getRoleVer = function() {
            return _self._getOverride(CloudExtKeys.roleVer);
        };
        return _this;
    }
    return CloudContext;
}(BaseContext));
export {
    CloudContext
};
//# sourceMappingURL=CloudContext.js.map