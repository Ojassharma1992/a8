/*
 * 1DS JS SDK Shared Analytics, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
var BaseContext = /** @class */ (function() {
    function BaseContext(container) {
        this._setOverride = function(key, value) {
            container.setOverride(key, value);
        };
        this._getOverride = function(key) {
            return container.getOverride(key);
        };
    }
    return BaseContext;
}());
export {
    BaseContext
};
//# sourceMappingURL=BaseContext.js.map