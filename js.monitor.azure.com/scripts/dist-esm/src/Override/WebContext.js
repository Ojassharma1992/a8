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
    isUndefined
} from "@microsoft/1ds-core-js";
import {
    WebExtensionKeys
} from "@microsoft/1ds-properties-js";
import {
    BaseContext
} from "./BaseContext";
var WebContext = /** @class */ (function(_super) {
    __extends(WebContext, _super);

    function WebContext(container, propertiesConfig) {
        var _this = _super.call(this, container) || this;
        var _self = _this;
        _self.setDomain = function(domain) {
            _self._setOverride(WebExtensionKeys.domain, domain);
        };
        _self.getDomain = function() {
            return _self._getOverride(WebExtensionKeys.domain);
        };
        _self.setBrowser = function(browser) {
            _self._setOverride(WebExtensionKeys.browser, browser);
        };
        _self.getBrowser = function() {
            return _self._getOverride(WebExtensionKeys.browser);
        };
        _self.setBrowserVer = function(browserVer) {
            _self._setOverride(WebExtensionKeys.browserVer, browserVer);
        };
        _self.getBrowserVer = function() {
            return _self._getOverride(WebExtensionKeys.browserVer);
        };
        _self.setScreenRes = function(screenRes) {
            _self._setOverride(WebExtensionKeys.screenRes, screenRes);
        };
        _self.getScreenRes = function() {
            return _self._getOverride(WebExtensionKeys.screenRes);
        };
        _self.setUserConsent = function(userConsent) {
            _self._setOverride(WebExtensionKeys.userConsent, userConsent);
        };
        _self.getUserContext = function() {
            return _self._getOverride(WebExtensionKeys.userConsent);
        };
        if (propertiesConfig) {
            if (!isUndefined(propertiesConfig.userConsented)) {
                _self.setUserConsent(propertiesConfig.userConsented);
            }
        }
        return _this;
    }
    return WebContext;
}(BaseContext));
export {
    WebContext
};
//# sourceMappingURL=WebContext.js.map