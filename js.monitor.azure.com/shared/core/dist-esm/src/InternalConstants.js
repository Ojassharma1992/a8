/*
 * 1DS JS SDK Core, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */

// Licensed under the MIT License.
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Note: DON'T Export these const from the package as we are still targeting ES3 this will export a mutable variables that someone could change!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Generally you should only put values that are used more than 2 times and then only if not already exposed as a constant (such as SdkCoreNames)
// as when using "short" named values from here they will be will be minified smaller than the SdkCoreNames[eSdkCoreNames.xxxx] value.
export var STR_EMPTY = "";
export var STR_DEFAULT_ENDPOINT_URL = "https://browser.events.data.microsoft.com/OneCollector/1.0/";
export var STR_PLUGIN_VERSION_STRING = "pluginVersionString";
export var STR_PLUGIN_VERSION_STRING_ARR = STR_PLUGIN_VERSION_STRING + "Arr";
export var STR_VERSION = "version";
export var STR_PROPERTIES = "properties";
//# sourceMappingURL=InternalConstants.js.map