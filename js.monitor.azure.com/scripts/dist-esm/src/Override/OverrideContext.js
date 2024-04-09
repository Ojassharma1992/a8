/*
 * 1DS JS SDK Shared Analytics, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
/**
 * OverrideContext.ts
 * @author Nev Wylie (newylie)
 * @copyright Microsoft 2019
 */
import {
    arrForEach,
    isString,
    isUndefined,
    objKeys
} from "@microsoft/1ds-core-js";
import {
    Extensions
} from "@microsoft/1ds-properties-js";
import {
    ApplicationContext
} from "./ApplicationContext";
import {
    CloudContext
} from "./CloudContext";
import {
    DataContext
} from "./DataContext";
import {
    DeviceContext
} from "./DeviceContext";
import {
    LocContext
} from "./LocContext";
import {
    OperatingSystemContext
} from "./OperatingSystemContext";
import {
    OverrideContainer
} from "./OverrideContainer";
import {
    UserContext
} from "./UserContext";
import {
    WebContext
} from "./WebContext";
// Use a local variable as the reference so it will be minified for the 25ish usages
/**
 * @ignore
 */
var _isString = isString;
/**
 * @ignore
 */
var Extension = "ext";
/**
 * @ignore
 */
var Data = "data";
var OverrideContext = /** @class */ (function() {
    function OverrideContext(coreConfig, propertiesConfig, core) {
        var _self = this;
        var _containers = {};

        function _getContainer(keys) {
            var lookupKey = "";
            for (var lp = 0; lp < keys.length; lp++) {
                if (lookupKey) {
                    lookupKey += "_";
                }
                lookupKey += keys[lp];
            }
            if (isUndefined(_containers[lookupKey])) {
                _containers[lookupKey] = new OverrideContainer(keys);
            }
            if (lookupKey) {
                return _containers[lookupKey];
            }
            return null;
        }
        _self.data = new DataContext(_getContainer([Data]));
        _self.app = new ApplicationContext(_getContainer([Extension, Extensions.AppExt]), propertiesConfig);
        _self.user = new UserContext(_getContainer([Extension, Extensions.UserExt]));
        _self.os = new OperatingSystemContext(_getContainer([Extension, Extensions.OSExt]), propertiesConfig);
        _self.web = new WebContext(_getContainer([Extension, Extensions.WebExt]), propertiesConfig);
        _self.device = new DeviceContext(_getContainer([Extension, Extensions.DeviceExt]));
        _self.loc = new LocContext(_getContainer([Extension, Extensions.LocExt]));
        _self.cloud = new CloudContext(_getContainer([Extension, Extensions.CloudExt]));
        _self.applyOverrides = function(item, itemCtx) {
            var keys = objKeys(_containers);
            if (keys && keys.length > 0) {
                arrForEach(keys, function(name) {
                    var container = _containers[name];
                    container.applyOverrides(item, itemCtx);
                });
            }
        };
    }
    return OverrideContext;
}());
export {
    OverrideContext
};
//# sourceMappingURL=OverrideContext.js.map