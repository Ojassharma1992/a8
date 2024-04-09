/*
 * 1DS JS SDK Shared Analytics, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
import {
    __extendsFn as __extends
} from "@microsoft/applicationinsights-shims";
import {
    BaseContext
} from "./BaseContext";
var DataContext = /** @class */ (function(_super) {
    __extends(DataContext, _super);

    function DataContext(container) {
        var _this = _super.call(this, container) || this;
        var _self = _this;
        _self.setProperty = function(name, value) {
            _self._setOverride(name, value);
        };
        _self.getProperty = function(name) {
            return _self._getOverride(name);
        };
        return _this;
    }
    return DataContext;
}(BaseContext));
export {
    DataContext
};
//# sourceMappingURL=DataContext.js.map