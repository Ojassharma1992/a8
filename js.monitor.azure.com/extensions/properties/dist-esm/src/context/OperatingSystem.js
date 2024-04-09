/*
 * 1DS JS SDK Properties plugin, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
/**
 * OperatingSystem.ts
 * @author Hector Hernandez (hectorh)
 * @copyright Microsoft 2019
 */
import {
    getNavigator,
    isString
} from "@microsoft/1ds-core-js";
var OSNAMEREGEX = {
    WIN: /(windows|win32)/i,
    WINRT: / arm;/i,
    WINPHONE: /windows\sphone\s\d+\.\d+/i,
    OSX: /(macintosh|mac os x)/i,
    IOS: /(ipad|iphone|ipod)(?=.*like mac os x)/i,
    LINUX: /(linux|joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk)/i,
    ANDROID: /android/i,
    CROS: /CrOS/i
};
var VERSION_MAPPINGS = {
    "5.1": "XP",
    "6.0": "Vista",
    "6.1": "7",
    "6.2": "8",
    "6.3": "8.1",
    "10.0": "10"
};
var REGEX_VERSION = "([\\d,.]+)";
var REGEX_VERSION_MAC = "([\\d,_,.]+)";
var UNKNOWN = "Unknown";
var OSNAMES = [{
        r: OSNAMEREGEX.WINPHONE,
        os: "Windows Phone"
    },
    {
        r: OSNAMEREGEX.WINRT,
        os: "Windows RT"
    },
    {
        r: OSNAMEREGEX.WIN,
        os: "Windows" /* OPERATING_SYSTEMS.WINDOWS */
    },
    {
        r: OSNAMEREGEX.IOS,
        os: "iOS" /* OPERATING_SYSTEMS.IOS */
    },
    {
        r: OSNAMEREGEX.ANDROID,
        os: "Android" /* OPERATING_SYSTEMS.ANDROID */
    },
    {
        r: OSNAMEREGEX.LINUX,
        os: "Linux"
    },
    {
        r: OSNAMEREGEX.CROS,
        os: "Chrome OS"
    },
    {
        s: "x11",
        os: "Unix"
    },
    {
        s: "blackberry",
        os: "BlackBerry"
    },
    {
        s: "symbian",
        os: "Symbian"
    },
    {
        s: "nokia",
        os: "Nokia"
    },
    {
        r: OSNAMEREGEX.OSX,
        os: "Mac OS X" /* OPERATING_SYSTEMS.MACOSX */
    }
];

function _getOsName(lowerCaseUserAgent) {
    for (var lp = 0; lp < OSNAMES.length; lp++) {
        var match = OSNAMES[lp];
        if (match.r && lowerCaseUserAgent.match(match.r)) {
            return match.os;
        } else if (match.s && lowerCaseUserAgent.indexOf(match.s) !== -1) {
            return match.os;
        }
    }
    return UNKNOWN;
}

function _getOsVersion(userAgent, osName) {
    if (osName === "Windows" /* OPERATING_SYSTEMS.WINDOWS */ ) {
        return _getGenericOsVersion(userAgent, "Windows NT");
    }
    if (osName === "Android" /* OPERATING_SYSTEMS.ANDROID */ ) {
        return _getGenericOsVersion(userAgent, osName);
    }
    if (osName === "Mac OS X" /* OPERATING_SYSTEMS.MACOSX */ ) {
        return _getMacOsxVersion(userAgent);
    }
    if (osName === "iOS" /* OPERATING_SYSTEMS.IOS */ ) {
        return _getIosVersion(userAgent);
    }
    return UNKNOWN;
}

function _getGenericOsVersion(userAgent, osName) {
    var ntVersionMatches = userAgent.match(new RegExp(osName + " " + REGEX_VERSION));
    if (ntVersionMatches) {
        if (VERSION_MAPPINGS[ntVersionMatches[1]]) {
            return VERSION_MAPPINGS[ntVersionMatches[1]];
        }
        return ntVersionMatches[1];
    }
    return UNKNOWN;
}

function _getMacOsxVersion(userAgent) {
    var macOsxVersionInUserAgentMatches = userAgent.match(new RegExp("Mac OS X" /* OPERATING_SYSTEMS.MACOSX */ + " " + REGEX_VERSION_MAC));
    if (macOsxVersionInUserAgentMatches) {
        var versionString = macOsxVersionInUserAgentMatches[1].replace(/_/g, ".");
        if (versionString) {
            var delimiter = _getDelimiter(versionString);
            if (delimiter) {
                var components = versionString.split(delimiter);
                return components[0];
            } else {
                return versionString;
            }
        }
    }
    return UNKNOWN;
}

function _getIosVersion(userAgent) {
    var iosVersionInUserAgentMatches = userAgent.match(new RegExp("OS " + REGEX_VERSION_MAC));
    if (iosVersionInUserAgentMatches) {
        var versionString = iosVersionInUserAgentMatches[1].replace(/_/g, ".");
        if (versionString) {
            var delimiter = _getDelimiter(versionString);
            if (delimiter) {
                var components = versionString.split(delimiter);
                return components[0];
            } else {
                return versionString;
            }
        }
    }
    return UNKNOWN;
}

function _getDelimiter(versionString) {
    if (versionString.indexOf(".") > -1) {
        return ".";
    }
    if (versionString.indexOf("_") > -1) {
        return "_";
    }
    return null;
}
var OperatingSystem = /** @class */ (function() {
    function OperatingSystem(propertiesConfig) {
        if (propertiesConfig.populateOperatingSystemInfo) {
            var self_1 = this;
            var theNav = getNavigator() || {};
            var userAgent = propertiesConfig.userAgent || theNav.userAgent || "";
            var userAgentData = propertiesConfig.userAgentData || theNav.userAgentData || {};
            if (userAgent) {
                var osName = _getOsName(userAgent.toLowerCase());
                self_1.name = osName;
                self_1.ver = _getOsVersion(userAgent, osName);
            }
            if ((!self_1.name || self_1.name === UNKNOWN) && isString(userAgentData.platform)) {
                self_1.name = userAgentData.platform;
            }
        }
    }
    return OperatingSystem;
}());
export {
    OperatingSystem
};
//# sourceMappingURL=OperatingSystem.js.map