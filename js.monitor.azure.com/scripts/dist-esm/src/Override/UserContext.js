/*
 * 1DS JS SDK Shared Analytics, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
import {
    __extendsFn as __extends
} from "@microsoft/applicationinsights-shims";
/**
 * Application.ts
 * @author Nev Wylie (newylie)
 * @copyright Microsoft 2019
 */
import {
    UserExtensionKeys
} from "@microsoft/1ds-properties-js";
import {
    BaseContext
} from "./BaseContext";
var UserContext = /** @class */ (function(_super) {
    __extends(UserContext, _super);

    function UserContext(container) {
        var _this = _super.call(this, container) || this;
        var _self = _this;
        _self.setLocalId = function(localId) {
            _self._setOverride(UserExtensionKeys.localId, localId);
        };
        _self.getLocalId = function() {
            return _self._getOverride(UserExtensionKeys.localId);
        };
        _self.setLocale = function(locale) {
            _self._setOverride(UserExtensionKeys.locale, locale);
        };
        _self.getLocale = function() {
            return _self._getOverride(UserExtensionKeys.locale);
        };
        _self.setId = function(userId) {
            _self._setOverride(UserExtensionKeys.id, userId);
        };
        _self.getId = function() {
            return _self._getOverride(UserExtensionKeys.id);
        };
        return _this;
    }
    return UserContext;
}(BaseContext));
export {
    UserContext
};
//# sourceMappingURL=UserContext.js.map