/*
 * 1DS JS SDK Shared Analytics, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
/**
 * OverrideContainer.ts
 * @author Nev Wylie (newylie)
 * @copyright Microsoft 2019
 */
import {
    arrForEach,
    isNullOrUndefined,
    isUndefined
} from "@microsoft/1ds-core-js";
/**
 * @ignore
 */
function _getEventRoot(item, keys) {
    if (item) {
        for (var lp = 0; lp < keys.length; lp++) {
            var theKey = keys[lp];
            if (isNullOrUndefined(item[theKey])) {
                item[theKey] = {};
            }
            item = item[theKey];
        }
    }
    return item;
}
/**
 * @ignore
 */
function _setOverride(eventRoot, key, value) {
    if (eventRoot && key) {
        var tokens = key.split(".");
        var theKey = tokens[tokens.length - 1];
        if (tokens.length > 1) {
            eventRoot = _getEventRoot(eventRoot, tokens.slice(0, -1));
        }
        if (!isNullOrUndefined(value)) {
            eventRoot[theKey] = value;
        } else if (!isUndefined(eventRoot[theKey])) {
            // Value set to null or empty so remove the entry
            delete eventRoot[theKey];
        }
    }
}
var OverrideContainer = /** @class */ (function() {
    function OverrideContainer(keys) {
        var _this = this;
        var _overrideValues = [];
        _this.setOverride = function(key, value) {
            if (key) {
                _overrideValues.push({
                    key: key,
                    value: value
                });
            }
        };
        _this.hasOverride = function(key) {
            var theResult = false;
            arrForEach(_overrideValues, function(override) {
                if (override.key === key) {
                    theResult = true;
                }
            });
            return theResult;
        };
        _this.getOverride = function(key) {
            var theValue;
            arrForEach(_overrideValues, function(override) {
                if (override.key === key) {
                    theValue = override.value;
                }
            });
            return theValue;
        };
        _this.applyOverrides = function(item, itemCtx) {
            if (_overrideValues.length > 0) {
                try {
                    var eventRoot_1 = _getEventRoot(item, keys);
                    arrForEach(_overrideValues, function(override) {
                        _setOverride(eventRoot_1, override.key, override.value);
                    });
                } catch (e) {
                    // Left empty - Swallowing
                }
            }
        };
    }
    return OverrideContainer;
}());
export {
    OverrideContainer
};
//# sourceMappingURL=OverrideContainer.js.map