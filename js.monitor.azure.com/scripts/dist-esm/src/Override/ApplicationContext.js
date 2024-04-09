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
    isNullOrUndefined,
    isUndefined
} from "@microsoft/1ds-core-js";
import {
    AppExtensionKeys,
    Application
} from "@microsoft/1ds-properties-js";
import {
    BaseContext
} from "./BaseContext";
var ApplicationContext = /** @class */ (function(_super) {
    __extends(ApplicationContext, _super);

    function ApplicationContext(container, propertiesConfig) {
        var _this = _super.call(this, container) || this;
        var _self = _this;
        _self.setId = function(id) {
            _self._setOverride(AppExtensionKeys.id, id);
        };
        _self.getId = function() {
            return _self._getOverride(AppExtensionKeys.id);
        };
        _self.setVer = function(ver) {
            _self._setOverride(AppExtensionKeys.ver, ver);
        };
        _self.getVer = function() {
            return _self._getOverride(AppExtensionKeys.ver);
        };
        _self.setName = function(name) {
            _self._setOverride(AppExtensionKeys.appName, name);
        };
        _self.getName = function() {
            return _self._getOverride(AppExtensionKeys.appName);
        };
        _self.setLocale = function(locale) {
            _self._setOverride(AppExtensionKeys.locale, locale);
        };
        _self.getLocale = function() {
            return _self._getOverride(AppExtensionKeys.locale);
        };
        _self.setEnv = function(env) {
            _self._setOverride(AppExtensionKeys.env, env);
        };
        _self.getEnv = function() {
            return _self._getOverride(AppExtensionKeys.env);
        };
        _self.setExpId = function(expId) {
            _self._setOverride(AppExtensionKeys.expId, Application.validateAppExpId(expId));
        };
        _self.getExpId = function() {
            return _self._getOverride(AppExtensionKeys.expId);
        };
        if (propertiesConfig) {
            if (!isUndefined(propertiesConfig.env)) {
                _self.setEnv(propertiesConfig.env);
            }
            if (!isNullOrUndefined(propertiesConfig.expId)) {
                _self.setExpId(propertiesConfig.expId);
            }
        }
        return _this;
    }
    return ApplicationContext;
}(BaseContext));
export {
    ApplicationContext
};
//# sourceMappingURL=ApplicationContext.js.map