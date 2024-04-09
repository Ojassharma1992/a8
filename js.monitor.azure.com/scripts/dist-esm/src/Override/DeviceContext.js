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
    DeviceExtKeys
} from "@microsoft/1ds-properties-js";
import {
    BaseContext
} from "./BaseContext";
var DeviceContext = /** @class */ (function(_super) {
    __extends(DeviceContext, _super);

    function DeviceContext(container) {
        var _this = _super.call(this, container) || this;
        var _self = _this;
        _self.setLocalId = function(localId) {
            _self._setOverride(DeviceExtKeys.localId, localId);
        };
        _self.getLocalId = function() {
            return _self._getOverride(DeviceExtKeys.localId);
        };
        _self.setDeviceClass = function(deviceClass) {
            _self._setOverride(DeviceExtKeys.deviceClass, deviceClass);
        };
        _self.getDeviceClass = function() {
            return _self._getOverride(DeviceExtKeys.deviceClass);
        };
        _self.setMake = function(make) {
            _self._setOverride(DeviceExtKeys.make, make);
        };
        _self.getMake = function() {
            return _self._getOverride(DeviceExtKeys.make);
        };
        _self.setModel = function(model) {
            _self._setOverride(DeviceExtKeys.model, model);
        };
        _self.getModel = function() {
            return _self._getOverride(DeviceExtKeys.model);
        };
        return _this;
    }
    return DeviceContext;
}(BaseContext));
export {
    DeviceContext
};
//# sourceMappingURL=DeviceContext.js.map