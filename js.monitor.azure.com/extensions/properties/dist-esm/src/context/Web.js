/*
 * 1DS JS SDK Properties plugin, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
/**
 * Web.ts
 * @author Hector Hernandez (hectorh)
 * @copyright Microsoft 2019
 */
import dynamicProto from "@microsoft/dynamicproto-js";
import {
    getCookieValue,
    getLocation,
    getNavigator,
    getWindow,
    isArray,
    objDefineAccessors,
    safeGetCookieMgr,
    isUndefined
} from "@microsoft/1ds-core-js";
var USER_CONSENT_DETAILS = [
    "Required", "Analytics", "SocialMedia", "Advertising"
];
var REGEX_VERSION = "([\\d,.]+)";
var UNKNOWN = "Unknown";
var EDGE_CHROMIUM = "Edg/";
var USER_AGENTS = [{
        ua: "OPR/",
        b: "Opera" /* BROWSERS.OPERA */
    },
    {
        ua: "PhantomJS" /* BROWSERS.PHANTOMJS */ ,
        b: "PhantomJS" /* BROWSERS.PHANTOMJS */
    },
    {
        ua: "Edge" /* BROWSERS.EDGE */ ,
        b: "Edge" /* BROWSERS.EDGE */
    },
    {
        ua: EDGE_CHROMIUM,
        b: "Edge" /* BROWSERS.EDGE */
    },
    {
        ua: "Electron" /* BROWSERS.ELECTRON */ ,
        b: "Electron" /* BROWSERS.ELECTRON */
    },
    {
        ua: "Chrome" /* BROWSERS.CHROME */ ,
        b: "Chrome" /* BROWSERS.CHROME */
    },
    {
        ua: "Trident",
        b: "MSIE" /* BROWSERS.MSIE */
    },
    {
        ua: "MSIE ",
        b: "MSIE" /* BROWSERS.MSIE */
    },
    {
        ua: "Firefox" /* BROWSERS.FIREFOX */ ,
        b: "Firefox" /* BROWSERS.FIREFOX */
    },
    {
        ua: "Safari" /* BROWSERS.SAFARI */ ,
        b: "Safari" /* BROWSERS.SAFARI */
    },
    {
        ua: "SkypeShell" /* BROWSERS.SKYPE_SHELL */ ,
        b: "SkypeShell" /* BROWSERS.SKYPE_SHELL */
    } // Check for Skype shell
];
var BRANDS = [{
        br: "Microsoft Edge",
        b: "Edge" /* BROWSERS.EDGE */
    },
    {
        br: "Google Chrome",
        b: "Chrome" /* BROWSERS.CHROME */
    },
    {
        br: "Opera",
        b: "Opera" /* BROWSERS.OPERA */
    }
];

function _userAgentContainsString(searchString, userAgent) {
    return userAgent.indexOf(searchString) > -1;
}

function _getBrandVersion(match, brands) {
    for (var lp = 0; lp < brands.length; lp++) {
        if (match == brands[lp].brand) {
            return brands[lp].version;
        }
    }
    return null;
}

function _getBrowserName(userAgent) {
    if (userAgent) {
        for (var lp = 0; lp < USER_AGENTS.length; lp++) {
            var ua = USER_AGENTS[lp].ua;
            if (_userAgentContainsString(ua, userAgent)) {
                return USER_AGENTS[lp].b;
            }
        }
    }
    return UNKNOWN;
}

function _getBrowserVersion(userAgent, browserName) {
    if (browserName === "MSIE" /* BROWSERS.MSIE */ ) {
        return _getIeVersion(userAgent);
    }
    return _getOtherVersion(browserName, userAgent);
}

function _getIeVersion(userAgent) {
    var classicIeVersionMatches = userAgent.match(new RegExp("MSIE" /* BROWSERS.MSIE */ + " " + REGEX_VERSION));
    if (classicIeVersionMatches) {
        return classicIeVersionMatches[1];
    }
    var ieVersionMatches = userAgent.match(new RegExp("rv:" + REGEX_VERSION));
    if (ieVersionMatches) {
        return ieVersionMatches[1];
    }
}

function _getOtherVersion(browserString, userAgent) {
    if (browserString === "Safari" /* BROWSERS.SAFARI */ ) {
        browserString = "Version";
    } else if (browserString === "Edge" /* BROWSERS.EDGE */ ) {
        if (_userAgentContainsString(EDGE_CHROMIUM, userAgent)) {
            browserString = "Edg";
        }
    }
    var matches = userAgent.match(new RegExp(browserString + "/" + REGEX_VERSION));
    if (matches) {
        return matches[1];
    }
    if (browserString === "Opera" /* BROWSERS.OPERA */ ) {
        matches = userAgent.match(new RegExp("OPR/" + REGEX_VERSION));
        if (matches) {
            return matches[1];
        }
    }
    return UNKNOWN;
}
/**
 * Get Screen resolution
 * @returns {ScreenResolution} - Screen resolution
 */
function _getScreenResolution() {
    var screenRes = {
        h: 0,
        w: 0
    };
    var win = getWindow();
    if (win && win.screen) {
        screenRes.h = screen.height;
        screenRes.w = screen.width;
    }
    return screenRes;
}

function _getUserConsent() {
    return this.getUserConsent();
}
var Web = /** @class */ (function() {
    function Web(propertiesConfig, core) {
        var _cookieMgr = safeGetCookieMgr(core);
        var _propertiesConfig = propertiesConfig || {};
        dynamicProto(Web, this, function(_self) {
            // Add the domain
            var windowLocation = getLocation();
            if (windowLocation) {
                var domain = windowLocation.hostname;
                if (domain) {
                    _self.domain = windowLocation.protocol === "file:" ? "local" : domain;
                }
            }
            if (_propertiesConfig.populateBrowserInfo) {
                var userAgent = _propertiesConfig.userAgent;
                var userAgentBrands = (_propertiesConfig.userAgentData || {}).brands;
                var theNav = getNavigator();
                if (theNav) {
                    userAgent = userAgent || theNav.userAgent || "";
                    userAgentBrands = userAgentBrands || (theNav.userAgentData || {}).brands;
                }
                _parseUserAgent(userAgent, userAgentBrands);
                var screenRes = _getScreenResolution();
                _self.screenRes = screenRes.w + "X" + screenRes.h;
            }
            // Only set if the configuration was provided
            if (!isUndefined(_propertiesConfig.gpcDataSharingOptIn)) {
                _self.gpcDataSharingOptIn = _propertiesConfig.gpcDataSharingOptIn;
            } else {
                _self.gpcDataSharingOptIn = null;
            }
            _self.getUserConsent = function() {
                return _propertiesConfig.userConsented || (getCookieValue(_cookieMgr, _propertiesConfig.userConsentCookieName || "MSCC") ? true : false);
            };
            /**
             *
             ** Function to retrieve user consent details.
             * @param callback - Callback function to get user consent details
             * @returns IUserContentDetails stringified object
             */
            _self.getUserConsentDetails = function() {
                var consentDetails = null;
                try {
                    var callback = _propertiesConfig.callback;
                    if (callback && callback.userConsentDetails) {
                        var result = callback.userConsentDetails();
                        if (result) {
                            if (_propertiesConfig.disableConsentDetailsSanitize) {
                                consentDetails = result;
                            } else {
                                consentDetails = {};
                            }
                            // Apply default values if missing
                            for (var lp = 0; lp < USER_CONSENT_DETAILS.length; lp++) {
                                var key = USER_CONSENT_DETAILS[lp];
                                consentDetails[key] = result[key] || false;
                            }
                        }
                    }
                    var gpcDataSharingOption = _self.gpcDataSharingOptIn;
                    // Only set if the configuration was provided
                    if (gpcDataSharingOption !== null) {
                        consentDetails = consentDetails || {};
                        consentDetails.GPC_DataSharingOptIn = !!gpcDataSharingOption;
                    }
                    return consentDetails ? JSON.stringify(consentDetails) : null;
                } catch (e) {
                    // Unexpected - Just making sure we don't crash
                }
            };

            function _parseUserAgent(userAgent, userAgentBrands) {
                if (isArray(userAgentBrands)) {
                    try {
                        // Go through the ordered list of "known" brands and use the first matching value
                        for (var lp = 0; lp < BRANDS.length; lp++) {
                            var version = _getBrandVersion(BRANDS[lp].br, userAgentBrands);
                            if (version) {
                                _self.browser = BRANDS[lp].b;
                                _self.browserVer = version;
                                return;
                            }
                        }
                    } catch (e) {
                        // Unexpected - Just making sure we don't crash
                    }
                }
                if (userAgent) {
                    var browserName = _getBrowserName(userAgent);
                    _self.browser = browserName;
                    _self.browserVer = _getBrowserVersion(userAgent, browserName);
                }
            }
            // Remap this get userContext for this instance
            objDefineAccessors(_self, "userConsent", _self.getUserConsent);
        });
    }
    // Removed Stub for Web.prototype.getUserConsent.
    // Removed Stub for Web.prototype.getUserConsentDetails.
    /**
     * Static constructor, attempt to create accessors
     */
    Web._staticInit = (function() {
        // Dynamically create get/set property accessors
        objDefineAccessors(Web.prototype, "userConsent", _getUserConsent);
    })();
    return Web;
}());
export {
    Web
};
//# sourceMappingURL=Web.js.map