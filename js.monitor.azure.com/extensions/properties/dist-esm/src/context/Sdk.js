/*
 * 1DS JS SDK Properties plugin, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
/**
 * Sdk.ts
 * @author Hector Hernandez (hectorh)
 * @copyright Microsoft 2019
 */
import dynamicProto from "@microsoft/dynamicproto-js";
import {
    getCookieValue,
    newGuid,
    random32,
    safeGetCookieMgr
} from "@microsoft/1ds-core-js";
var DEVICE_ID_COOKIE = "MicrosoftApplicationsTelemetryDeviceId";

function _saveData(mgr, propertyStorage, name, value) {
    if (propertyStorage) {
        propertyStorage.setProperty(name, value);
    } else {
        // Expires in 365 days (365 * 24 * 60 * 60)
        mgr.set(name, value, 31536000);
    }
}

function _getData(mgr, propertyStorage, name) {
    if (propertyStorage) {
        return propertyStorage.getProperty(name) || "";
    }
    return getCookieValue(mgr, name);
}
var Sdk = /** @class */ (function() {
    function Sdk(coreConfig, core) {
        var _sequenceId = 0;
        dynamicProto(Sdk, this, function(_self) {
            var propertyStorage = coreConfig.propertyStorageOverride;
            // Start sequence
            _self.seq = _sequenceId;
            _self.epoch = random32(false).toString();
            var mgr = safeGetCookieMgr(core, coreConfig);
            if (mgr.isEnabled() || propertyStorage) {
                // Only collect device id if it can be stored
                var deviceId = _getData(mgr, propertyStorage, DEVICE_ID_COOKIE);
                if (!deviceId) {
                    deviceId = newGuid();
                }
                _saveData(mgr, propertyStorage, DEVICE_ID_COOKIE, deviceId);
                _self.installId = deviceId;
            } else {
                mgr.purge(DEVICE_ID_COOKIE);
            }
            _self.getSequenceId = function() {
                return ++_sequenceId;
            };
        });
    }
    // Get seq value
    // Removed Stub for Sdk.prototype.getSequenceId.
    // This is a workaround for an IE8 bug when using dynamicProto() with classes that don't have any
    // non-dynamic functions or static properties/functions when using uglify-js to minify the resulting code.
    // this will be removed when ES3 support is dropped.
    Sdk.__ieDyn = 1;

    return Sdk;
}());
export {
    Sdk
};
//# sourceMappingURL=Sdk.js.map