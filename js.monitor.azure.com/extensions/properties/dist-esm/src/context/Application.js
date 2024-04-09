/*
 * 1DS JS SDK Properties plugin, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
/**
 * Application.ts
 * @author Hector Hernandez (hectorh)
 * @copyright Microsoft 2019
 */
import dynamicProto from "@microsoft/dynamicproto-js";
import {
    getCookieValue,
    getDocument,
    hasDocument,
    objDefineAccessors,
    safeGetCookieMgr
} from "@microsoft/1ds-core-js";
export var defaultFlightIdNameSpaces = [
    "AX",
    "EX",
    "SF",
    "CS",
    "CF",
    "CT",
    "CU",
    "DC",
    "DF",
    "H5",
    "HL",
    "WS",
    "WP" // WINDOWSPHONE
];
/// <summary>Validate each flight id in appExpId against the app flight ID
/// format and create a comma seperated appExpId with valid flight ids.Ignore invalid flight IDs< /summary>
/// <param type='Object'>A list of comma seperated appExpId</param>
/// <returns type='void'>none</returns>
function _validateAppExpId(appExpIdNew, flightIdNameSpaces) {
    if (flightIdNameSpaces === void 0) {
        flightIdNameSpaces = defaultFlightIdNameSpaces;
    }
    var appExpId = null;
    if (appExpIdNew) {
        var expIdArray = appExpIdNew.split(",");
        for (var i = 0; i < expIdArray.length; i++) {
            if (_isValidAppFlightId(expIdArray[i], flightIdNameSpaces)) {
                if (!appExpId) {
                    appExpId = expIdArray[i];
                } else {
                    appExpId += "," + expIdArray[i];
                }
            } else {
                // this._traceLogger.w('Unsupported flight id format for this app expId: ' + expIdArray[i]);
            }
        }
    }
    return appExpId;
}
/// <summary>Verify an expId against the CS2.1 spec</summary>
/// <param type='Object'>expId to verify in string format</param>
/// <returns type='true'>true if expId is valid, false otherwise</returns>
function _isValidAppFlightId(appFlightId, flightIdNameSpaces) {
    if (flightIdNameSpaces === void 0) {
        flightIdNameSpaces = defaultFlightIdNameSpaces;
    }
    if (!appFlightId || appFlightId.length < 4) {
        return false;
    }
    var isValid = false;
    var MAXFLIGHTIDLENGTH = 256;
    var curNameSpace = (appFlightId.substring(0, 3)).toString().toUpperCase();
    // The prefix check must include ':', else strings starting with prefixes will slip through
    for (var i = 0; i < flightIdNameSpaces.length; i++) {
        if (flightIdNameSpaces[i] + ":" === curNameSpace && appFlightId.length <= MAXFLIGHTIDLENGTH) {
            isValid = true;
            break;
        }
    }
    return isValid;
}

function _getExpId() {
    return this.getExpId();
}
var Application = /** @class */ (function() {
    function Application(propertiesConfig, core) {
        var _appExpId = null;
        // Create a copy of the defaultNamespaces
        var flightIdNameSpaces = defaultFlightIdNameSpaces.slice(0);
        var expIdCookieName = "Treatments";
        var _cookieMgr = safeGetCookieMgr(core);
        var _propertiesConfig = propertiesConfig;
        dynamicProto(Application, this, function(_self) {
            // Add app language
            if (hasDocument()) {
                var documentElement = getDocument().documentElement;
                if (documentElement) {
                    _self.locale = documentElement.lang;
                }
            }
            _self.env = propertiesConfig.env ? propertiesConfig.env : _getMetaDataFromDOM("awa-")["env"];
            _self.getExpId = function() {
                return _propertiesConfig.expId ? _readExpIdFromCoreData(_propertiesConfig.expId) : _readExpIdFromCookie();
            };
            /**
             * Retrieve a specified metadata tag value from the DOM.
             * @param prefix - Prefix to search the metatags with.
             * @returns Metadata collection/property bag
             */
            function _getMetaDataFromDOM(prefix) {
                var metaElements;
                var metaData = {};
                var doc = getDocument();
                if (doc) {
                    metaElements = doc && doc.querySelectorAll("meta");
                    for (var i = 0; i < metaElements.length; i++) {
                        var meta = metaElements[i];
                        if (meta.name) {
                            var mt = meta.name.toLowerCase();
                            if (mt.indexOf(prefix) === 0) {
                                var name = meta.name.replace(prefix, "");
                                metaData[name] = meta.content;
                            }
                        }
                    }
                }
                return metaData;
            }
            /// <summary>Validate each flight id in appExpId against the app flight ID
            /// format and create a comma seperated appExpId with valid flight ids.Ignore invalid flight IDs< /summary>
            /// <param type='Object'>A list of comma seperated appExpId</param>
            /// <returns type='void'>none</returns>
            function _setAppExpId(appExpIdNew) {
                if (appExpIdNew === _appExpId) {
                    return; // Nothing to do if seen before
                }
                // Reset to empty first. The new but invalid appExpId should not be logged and we cannot leave the old one hanging around
                // since it means old experiment id cannot represent the new experiment with an invalid appExpId.
                _appExpId = _validateAppExpId(appExpIdNew, flightIdNameSpaces);
            }

            function _readExpIdFromCookie() {
                var cookieValue = getCookieValue(_cookieMgr, expIdCookieName);
                _setAppExpId(cookieValue);
                return _appExpId;
            }

            function _readExpIdFromCoreData(expId) {
                _setAppExpId(expId);
                return _appExpId;
            }
        });
    }
    // Removed Stub for Application.prototype.getExpId.
    /// <summary>Validate each flight id in appExpId against the app flight ID
    /// format and create a comma seperated appExpId with valid flight ids.Ignore invalid flight IDs< /summary>
    /// <param type='Object'>A list of comma seperated appExpId</param>
    /// <returns type='void'>none</returns>
    /**
     * Validate each flight id in appExpId against the app flight ID format and create
     * a comma seperated appExpId with valid flight ids.Ignore invalid flight IDs
     * @param appExpId - The current experiment id
     * @param appExpIdNew - The new experiment id to set (if valid)
     * @param flightIdNameSpaces - The valid set of flight id names
     * @returns The validated experiment id,
     */
    Application.validateAppExpId = _validateAppExpId;
    /**
     * Static constructor, attempt to create accessors
     */
    Application._staticInit = (function() {
        // Dynamically create get/set property accessors
        objDefineAccessors(Application.prototype, "expId", _getExpId);
    })();
    return Application;
}());
export {
    Application
};
//# sourceMappingURL=Application.js.map