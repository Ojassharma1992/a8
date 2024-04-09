/*
 * 1DS JS SDK Shared Analytics, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
import {
    __extendsFn as __extends
} from "@microsoft/applicationinsights-shims";
/**
 * LocContext.ts
 * @copyright Microsoft 2020
 */
import {
    LocExtKeys
} from "@microsoft/1ds-properties-js";
import {
    BaseContext
} from "./BaseContext";
var LocContext = /** @class */ (function(_super) {
    __extends(LocContext, _super);

    function LocContext(container) {
        var _this = _super.call(this, container) || this;
        var _self = _this;
        _self.setTz = function(tz) {
            _self._setOverride(LocExtKeys.tz, tz);
        };
        _self.getTz = function() {
            return _self._getOverride(LocExtKeys.tz);
        };
        return _this;
    }
    return LocContext;
}(BaseContext));
export {
    LocContext
};
//# sourceMappingURL=LocContext.js.map