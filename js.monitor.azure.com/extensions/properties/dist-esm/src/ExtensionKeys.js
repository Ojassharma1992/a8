/*
 * 1DS JS SDK Properties plugin, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
/**
 * TelemetryContext.ts
 * @author Hector Hernandez (hectorh)
 * @copyright Microsoft 2019
 */
// @skip-file-minify - Skip attempting to minify this file
import {
    createValueMap
} from "@microsoft/applicationinsights-core-js";
import {
    STR_BROWSER,
    STR_BROWSER_VER,
    STR_DEVICE,
    STR_EVENT_FLAGS,
    STR_LOCALE,
    STR_NAME,
    STR_POP_SAMPLE,
    STR_SERVICE_NAME,
    STR_VER
} from "./InternalConstants";
export var Extensions = createValueMap({
    UserExt: [0 /* eExtensions.UserExt */ , "user"],
    DeviceExt: [1 /* eExtensions.DeviceExt */ , STR_DEVICE],
    TraceExt: [2 /* eExtensions.TraceExt */ , "trace"],
    WebExt: [3 /* eExtensions.WebExt */ , "web"],
    AppExt: [4 /* eExtensions.AppExt */ , "app"],
    OSExt: [5 /* eExtensions.OSExt */ , "os"],
    SdkExt: [6 /* eExtensions.SdkExt */ , "sdk"],
    IntWebExt: [7 /* eExtensions.IntWebExt */ , "intweb"],
    UtcExt: [8 /* eExtensions.UtcExt */ , "utc"],
    LocExt: [9 /* eExtensions.LocExt */ , "loc"],
    CloudExt: [10 /* eExtensions.CloudExt */ , "cloud"],
    DtExt: [11 /* eExtensions.DtExt */ , "dt"]
});
export var AppExtensionKeys = createValueMap({
    id: [0 /* eAppExtensionKeys.id */ , "id"],
    ver: [1 /* eAppExtensionKeys.ver */ , STR_VER],
    appName: [2 /* eAppExtensionKeys.appName */ , STR_NAME],
    locale: [3 /* eAppExtensionKeys.locale */ , STR_LOCALE],
    expId: [4 /* eAppExtensionKeys.expId */ , "expId"],
    env: [5 /* eAppExtensionKeys.env */ , "env"]
});
export var WebExtensionKeys = createValueMap({
    domain: [0 /* eWebExtensionKeys.domain */ , "domain"],
    browser: [1 /* eWebExtensionKeys.browser */ , STR_BROWSER],
    browserVer: [2 /* eWebExtensionKeys.browserVer */ , STR_BROWSER_VER],
    screenRes: [3 /* eWebExtensionKeys.screenRes */ , "screenRes"],
    userConsent: [4 /* eWebExtensionKeys.userConsent */ , "userConsent"],
    consentDetails: [5 /* eWebExtensionKeys.consentDetails */ , "consentDetails"]
});
export var UserExtensionKeys = createValueMap({
    locale: [0 /* eUserExtensionKeys.locale */ , STR_LOCALE],
    localId: [1 /* eUserExtensionKeys.localId */ , "localId"],
    id: [2 /* eUserExtensionKeys.id */ , "id"]
});
export var OSExtKeys = createValueMap({
    osName: [0 /* eOSExtKeys.osName */ , STR_NAME],
    ver: [1 /* eOSExtKeys.ver */ , STR_VER]
});
export var SDKExtKeys = createValueMap({
    ver: [0 /* eSDKExtKeys.ver */ , STR_VER],
    seq: [1 /* eSDKExtKeys.seq */ , "seq"],
    installId: [2 /* eSDKExtKeys.installId */ , "installId"],
    epoch: [3 /* eSDKExtKeys.epoch */ , "epoch"]
});
export var IntWebExtKeys = createValueMap({
    msfpc: [0 /* eIntWebExtKeys.msfpc */ , "msfpc"],
    anid: [1 /* eIntWebExtKeys.anid */ , "anid"],
    serviceName: [2 /* eIntWebExtKeys.serviceName */ , STR_SERVICE_NAME]
});
export var UtcExtKeys = createValueMap({
    popSample: [0 /* eUtcExtKeys.popSample */ , STR_POP_SAMPLE],
    eventFlags: [1 /* eUtcExtKeys.eventFlags */ , STR_EVENT_FLAGS]
});
export var LocExtKeys = createValueMap({
    tz: [0 /* eLocExtKeys.tz */ , "tz"]
});
export var SessionExtKeys = createValueMap({
    sessionId: [0 /* eSessionExtKeys.sessionId */ , "sesId"]
});
export var DeviceExtKeys = createValueMap({
    localId: [0 /* eDeviceExtKeys.localId */ , "localId"],
    deviceClass: [1 /* eDeviceExtKeys.deviceClass */ , "deviceClass"],
    make: [2 /* eDeviceExtKeys.make */ , "make"],
    model: [3 /* eDeviceExtKeys.model */ , "model"]
});
export var CloudExtKeys = createValueMap({
    role: [0 /* eCloudExtKeys.role */ , "role"],
    roleInstance: [1 /* eCloudExtKeys.roleInstance */ , "roleInstance"],
    roleVer: [2 /* eCloudExtKeys.roleVer */ , "roleVer"]
});
export var TraceExtKeys = createValueMap({
    traceId: [0 /* eTraceExtKeys.traceId */ , "traceID"],
    traceName: [1 /* eTraceExtKeys.traceName */ , STR_NAME],
    parentId: [2 /* eTraceExtKeys.parentId */ , "parentID"]
});
export var DistributedTraceExtKeys = createValueMap({
    traceId: [0 /* eDistributedTraceExtKeys.traceId */ , "traceId"],
    spanId: [1 /* eDistributedTraceExtKeys.spanId */ , "spanId"],
    traceFlags: [2 /* eDistributedTraceExtKeys.traceFlags */ , "traceFlags"]
});
//# sourceMappingURL=ExtensionKeys.js.map