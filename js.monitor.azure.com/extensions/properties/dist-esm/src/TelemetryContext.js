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
import dynamicProto from "@microsoft/dynamicproto-js";
import {
    isBoolean,
    isNullOrUndefined,
    isNumber,
    isString,
    isValidSpanId,
    isValidTraceId,
    objForEachKey
} from "@microsoft/1ds-core-js";
import {
    AppExtensionKeys,
    CloudExtKeys,
    DeviceExtKeys,
    DistributedTraceExtKeys,
    Extensions,
    IntWebExtKeys,
    LocExtKeys,
    OSExtKeys,
    SDKExtKeys,
    SessionExtKeys,
    TraceExtKeys,
    UserExtensionKeys,
    UtcExtKeys,
    WebExtensionKeys
} from "./ExtensionKeys";
import {
    SessionManager
} from "./SessionManager";
import {
    Application
} from "./context/Application";
import {
    Cloud
} from "./context/Cloud";
import {
    Device
} from "./context/Device";
import {
    IntWeb
} from "./context/IntWeb";
import {
    Loc
} from "./context/Loc";
import {
    OperatingSystem
} from "./context/OperatingSystem";
import {
    Sdk
} from "./context/Sdk";
import {
    Session
} from "./context/Session";
import {
    Trace
} from "./context/Trace";
import {
    User
} from "./context/User";
import {
    Utc
} from "./context/Utc";
import {
    Web
} from "./context/Web";

function _applyExtValues(extension, event, names, map, overwriteTarget) {
    var target = event.ext[Extensions[extension]];
    if (target) {
        try {
            objForEachKey(map, function(field, value) {
                if (isString(value) || isNumber(value) || isBoolean(value)) {
                    var targetValue = target[names[field]];
                    if (!overwriteTarget && (targetValue || isString(targetValue) || isNumber(targetValue) || isBoolean(targetValue))) {
                        value = targetValue;
                    }
                    target[names[field]] = value;
                }
            });
        } catch (e) {
            // During unload some accesses may cause a TypeError due to accessing a dead object
        }
    }
    return target;
}
var TelemetryContext = /** @class */ (function() {
    function TelemetryContext(coreConfig, propertiesConfig, core) {
        dynamicProto(TelemetryContext, this, function(_self) {
            _self.app = new Application(propertiesConfig, core);
            _self.cloud = new Cloud();
            _self.user = new User(coreConfig, propertiesConfig, core);
            _self.os = new OperatingSystem(propertiesConfig);
            _self.web = new Web(propertiesConfig, core);
            var _sdk = new Sdk(coreConfig, core);
            var _intWeb = new IntWeb(propertiesConfig, core);
            var _utc = new Utc(propertiesConfig);
            _self.loc = new Loc();
            _self.device = new Device();
            var _sessionManager = new SessionManager(core, propertiesConfig);
            _self.session = new Session();
            var _distributedTraceCtx = createDistributedTraceContextFromTraceCtx(new Trace(propertiesConfig), _getTraceCtx());
            var _overwriteEventPartA = !(propertiesConfig || {}).eventContainExtFields;

            function _getSessionId() {
                var session = _self.session;
                if (session && isString(session.customId)) {
                    return session.customId;
                }
                _sessionManager.update();
                var autoSession = _sessionManager.automaticSession;
                if (autoSession) {
                    var autoId = autoSession.getId();
                    if (autoId && isString(autoId)) {
                        session.automaticId = autoId;
                    }
                }
                return session.automaticId;
            }
            _self.getTraceCtx = function() {
                return _distributedTraceCtx;
            };
            _self.getSessionId = _getSessionId;
            _self.applyApplicationContext = function(event) {
                var _a;
                var app = _self.app;
                _applyExtValues(4 /* eExtensions.AppExt */ , event, AppExtensionKeys, (_a = {},
                    _a[0 /* eAppExtensionKeys.id */ ] = app.id,
                    _a[1 /* eAppExtensionKeys.ver */ ] = app.ver,
                    _a[2 /* eAppExtensionKeys.appName */ ] = app.name,
                    _a[3 /* eAppExtensionKeys.locale */ ] = app.locale,
                    _a[4 /* eAppExtensionKeys.expId */ ] = app.getExpId(),
                    _a[5 /* eAppExtensionKeys.env */ ] = app.env,
                    _a), _overwriteEventPartA);
            };
            _self.applyUserContext = function(event) {
                var _a;
                var user = _self.user;
                _applyExtValues(0 /* eExtensions.UserExt */ , event, UserExtensionKeys, (_a = {},
                    _a[1 /* eUserExtensionKeys.localId */ ] = user.getLocalId(),
                    _a[0 /* eUserExtensionKeys.locale */ ] = user.locale,
                    _a[2 /* eUserExtensionKeys.id */ ] = user.id,
                    _a), _overwriteEventPartA);
            };
            _self.applyWebContext = function(event) {
                var _a;
                var web = _self.web;
                _applyExtValues(3 /* eExtensions.WebExt */ , event, WebExtensionKeys, (_a = {},
                    _a[0 /* eWebExtensionKeys.domain */ ] = web.domain,
                    _a[1 /* eWebExtensionKeys.browser */ ] = web.browser,
                    _a[2 /* eWebExtensionKeys.browserVer */ ] = web.browserVer,
                    _a[3 /* eWebExtensionKeys.screenRes */ ] = web.screenRes,
                    _a[5 /* eWebExtensionKeys.consentDetails */ ] = web.getUserConsentDetails(),
                    _a[4 /* eWebExtensionKeys.userConsent */ ] = web.getUserConsent(),
                    _a), _overwriteEventPartA);
            };
            _self.applyOsContext = function(event) {
                var _a;
                var os = _self.os;
                _applyExtValues(5 /* eExtensions.OSExt */ , event, OSExtKeys, (_a = {},
                    _a[0 /* eOSExtKeys.osName */ ] = os.name,
                    _a[1 /* eOSExtKeys.ver */ ] = os.ver,
                    _a), _overwriteEventPartA);
            };
            _self.applySdkContext = function(event) {
                var _a;
                _applyExtValues(6 /* eExtensions.SdkExt */ , event, SDKExtKeys, (_a = {},
                    _a[2 /* eSDKExtKeys.installId */ ] = _sdk.installId,
                    _a[1 /* eSDKExtKeys.seq */ ] = _sdk.getSequenceId(),
                    _a[3 /* eSDKExtKeys.epoch */ ] = _sdk.epoch,
                    _a), _overwriteEventPartA);
            };
            _self.applyIntWebContext = function(event) {
                var _a;
                _applyExtValues(7 /* eExtensions.IntWebExt */ , event, IntWebExtKeys, (_a = {},
                    _a[0 /* eIntWebExtKeys.msfpc */ ] = _intWeb.getMsfpc(),
                    _a[1 /* eIntWebExtKeys.anid */ ] = _intWeb.getAnid(),
                    _a[2 /* eIntWebExtKeys.serviceName */ ] = _intWeb.serviceName,
                    _a), _overwriteEventPartA);
            };
            _self.applyUtcContext = function(event) {
                var _a;
                var utcFields = (_a = {},
                    _a[0 /* eUtcExtKeys.popSample */ ] = _utc.popSample,
                    _a);
                if (_utc.eventFlags > 0) {
                    utcFields[1 /* eUtcExtKeys.eventFlags */ ] = _utc.eventFlags;
                }
                _applyExtValues(8 /* eExtensions.UtcExt */ , event, UtcExtKeys, utcFields, _overwriteEventPartA);
            };
            _self.applyLocContext = function(event) {
                var _a;
                _applyExtValues(9 /* eExtensions.LocExt */ , event, LocExtKeys, (_a = {},
                    _a[0 /* eLocExtKeys.tz */ ] = _self.loc.tz,
                    _a), _overwriteEventPartA);
            };
            _self.applySessionContext = function(event) {
                var _a;
                _applyExtValues(4 /* eExtensions.AppExt */ , event, SessionExtKeys, (_a = {},
                    _a[0 /* eSessionExtKeys.sessionId */ ] = _getSessionId(),
                    _a), _overwriteEventPartA);
            };
            _self.applyDeviceContext = function(event) {
                var _a;
                var device = _self.device;
                _applyExtValues(1 /* eExtensions.DeviceExt */ , event, DeviceExtKeys, (_a = {},
                    _a[0 /* eDeviceExtKeys.localId */ ] = device.localId,
                    _a[2 /* eDeviceExtKeys.make */ ] = device.make,
                    _a[3 /* eDeviceExtKeys.model */ ] = device.model,
                    _a[1 /* eDeviceExtKeys.deviceClass */ ] = device.deviceClass,
                    _a), _overwriteEventPartA);
            };
            _self.applyCloudContext = function(event) {
                var _a;
                var cloud = _self.cloud;
                _applyExtValues(10 /* eExtensions.CloudExt */ , event, CloudExtKeys, (_a = {},
                    _a[0 /* eCloudExtKeys.role */ ] = cloud.role,
                    _a[1 /* eCloudExtKeys.roleInstance */ ] = cloud.roleInstance,
                    _a[2 /* eCloudExtKeys.roleVer */ ] = cloud.roleVer,
                    _a), _overwriteEventPartA);
            };
            _self.applyAITraceContext = function(event) {
                var _a;
                if (propertiesConfig.enableApplicationInsightsTrace) {
                    var distributedTrace = _getTraceCtx();
                    if (distributedTrace) {
                        _applyExtValues(2 /* eExtensions.TraceExt */ , event, TraceExtKeys, (_a = {},
                            _a[0 /* eTraceExtKeys.traceId */ ] = distributedTrace.getTraceId(),
                            _a[1 /* eTraceExtKeys.traceName */ ] = distributedTrace.getName(),
                            _a[2 /* eTraceExtKeys.parentId */ ] = distributedTrace.getSpanId(),
                            _a), false); // Always allow the event to define these values
                    }
                }
            };
            _self.applyDistributedTraceContext = function(event) {
                var _a;
                var distributedTrace = _getTraceCtx();
                if (distributedTrace) {
                    var traceFields = (_a = {},
                        _a[0 /* eDistributedTraceExtKeys.traceId */ ] = distributedTrace.getTraceId(),
                        _a[1 /* eDistributedTraceExtKeys.spanId */ ] = distributedTrace.getSpanId(),
                        _a);
                    var traceFlags = distributedTrace.getTraceFlags();
                    if (!isNullOrUndefined(traceFlags)) {
                        traceFields[2 /* eDistributedTraceExtKeys.traceFlags */ ] = traceFlags;
                    }
                    // Always allow the event to define these values
                    _applyExtValues(11 /* eExtensions.DtExt */ , event, DistributedTraceExtKeys, traceFields, false);
                }
            };

            function _getTraceCtx() {
                var traceCtx = _distributedTraceCtx;
                if (core && core.getTraceCtx) {
                    traceCtx = core.getTraceCtx(false) || _distributedTraceCtx;
                }
                return traceCtx;
            }
        });
    }
    // Removed Stub for TelemetryContext.prototype.getTraceCtx.
    // Removed Stub for TelemetryContext.prototype.getSessionId.
    // Removed Stub for TelemetryContext.prototype.applyApplicationContext.
    // Removed Stub for TelemetryContext.prototype.applyUserContext.
    // Removed Stub for TelemetryContext.prototype.applyWebContext.
    // Removed Stub for TelemetryContext.prototype.applyOsContext.
    // Removed Stub for TelemetryContext.prototype.applySdkContext.
    // Removed Stub for TelemetryContext.prototype.applyIntWebContext.
    // Removed Stub for TelemetryContext.prototype.applyUtcContext.
    // Removed Stub for TelemetryContext.prototype.applyLocContext.
    // Removed Stub for TelemetryContext.prototype.applySessionContext.
    // Removed Stub for TelemetryContext.prototype.applyDeviceContext.
    // Removed Stub for TelemetryContext.prototype.applyCloudContext.
    // Removed Stub for TelemetryContext.prototype.applyAITraceContext.
    // Removed Stub for TelemetryContext.prototype.applyDistributedTraceContext.
    // This is a workaround for an IE8 bug when using dynamicProto() with classes that don't have any
    // non-dynamic functions or static properties/functions when using uglify-js to minify the resulting code.
    // this will be removed when ES3 support is dropped.
    TelemetryContext.__ieDyn = 1;

    return TelemetryContext;
}());
export {
    TelemetryContext
};
/**
 * Creates a IDistributedTraceContext from an optional telemetryTrace
 * @param traceContext - The ITraceContext instance that is being wrapped
 * @param parentCtx - An optional parent distributed trace instance, almost always undefined as this scenario is only used in the case of multiple property handlers.
 * @returns A new IDistributedTraceContext instance that is backed by the traceContext or temporary object
 */
function createDistributedTraceContextFromTraceCtx(traceContext, parentCtx) {
    var trace = traceContext || {};
    return {
        getName: function() {
            return trace.name;
        },
        setName: function(newValue) {
            parentCtx && parentCtx.setName(newValue);
            trace.name = newValue;
        },
        getTraceId: function() {
            return trace.traceId;
        },
        setTraceId: function(newValue) {
            parentCtx && parentCtx.setTraceId(newValue);
            if (isValidTraceId(newValue)) {
                trace.traceId = newValue;
            }
        },
        getSpanId: function() {
            return trace.parentId;
        },
        setSpanId: function(newValue) {
            parentCtx && parentCtx.setSpanId(newValue);
            if (isValidSpanId(newValue)) {
                trace.parentId = newValue;
            }
        },
        getTraceFlags: function() {
            return trace.traceFlags;
        },
        setTraceFlags: function(newTraceFlags) {
            parentCtx && parentCtx.setTraceFlags(newTraceFlags);
            trace.traceFlags = newTraceFlags;
        }
    };
}
//# sourceMappingURL=TelemetryContext.js.map