/*
 * 1DS JS SDK Properties plugin, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */

// Licensed under the MIT License.
import {
    strShimPrototype
} from "@microsoft/applicationinsights-shims";
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Note: DON'T Export these const from the package as we are still targeting ES3 this will export a mutable variables that someone could change!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Generally you should only put values that are used more than 2 times and then only if not already exposed as a constant (such as SdkCoreNames)
// as when using "short" named values from here they will be will be minified smaller than the SdkCoreNames[eSdkCoreNames.xxxx] value.
export var STR_DEVICE = "device";
export var STR_LOCALE = "locale";
export var STR_VER = "ver";
export var STR_BROWSER = "browser";
export var STR_BROWSER_VER = "browserVer";
export var STR_POP_SAMPLE = "popSample";
export var STR_EVENT_FLAGS = "eventFlags";
export var STR_NAME = "name";
export var STR_SERVICE_NAME = "serviceName";
export var STR_LENGTH = "length";
export var STR_SESSION_EXPIRATION_MS = "sessionExpirationMs";
export var STR_SESSION_RENEWAL_MS = "sessionRenewalMs";
export var STR_USER_AGENT = "userAgent";
export var STR_USER_AGENT_DATA = "userAgentData";
export var STR_NAME_PREFIX = "namePrefix";
export var STR_PROTOTYPE = strShimPrototype;
//# sourceMappingURL=InternalConstants.js.map