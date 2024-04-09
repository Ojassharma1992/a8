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
    OSExtKeys,
    OperatingSystem
} from "@microsoft/1ds-properties-js";
import {
    BaseContext
} from "./BaseContext";
var OperatingSystemContext = /** @class */ (function(_super) {
    __extends(OperatingSystemContext, _super);

    function OperatingSystemContext(container, propertiesConfig) {
        var _this = _super.call(this, container) || this;
        var _self = _this;
        _self.setOsName = function(osName) {
            _self._setOverride(OSExtKeys.osName, osName);
        };
        _self.getOsName = function() {
            return _self._getOverride(OSExtKeys.osName);
        };
        _self.setVer = function(ver) {
            _self._setOverride(OSExtKeys.ver, ver);
        };
        _self.getVer = function() {
            return _self._getOverride(OSExtKeys.ver);
        };
        if (propertiesConfig &&
            propertiesConfig.userAgent &&
            propertiesConfig.populateOperatingSystemInfo) {
            var operatingSystem = new OperatingSystem(propertiesConfig);
            _self.setOsName(operatingSystem.name);
            _self.setVer(operatingSystem.ver);
        }
        return _this;
    }
    return OperatingSystemContext;
}(BaseContext));
export {
    OperatingSystemContext
};
//# sourceMappingURL=OperatingSystemContext.js.map