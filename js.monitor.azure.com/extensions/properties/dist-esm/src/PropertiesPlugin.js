/*
 * 1DS JS SDK Properties plugin, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
import {
    __extendsFn as __extends
} from "@microsoft/applicationinsights-shims";
/**
 * PropertiesPlugin.ts
 * @author Abhilash Panwar (abpanwar) Hector Hernandez (hectorh)
 * @copyright Microsoft 2018
 */
import dynamicProto from "@microsoft/dynamicproto-js";
import {
    BaseTelemetryPlugin,
    arrForEach,
    objForEachKey,
    objKeys,
    setProcessTelemetryTimings
} from "@microsoft/1ds-core-js";
import {
    Extensions
} from "./ExtensionKeys";
import {
    TelemetryContext
} from "./TelemetryContext";
var extensions = [
    Extensions[4 /* eExtensions.AppExt */ ],
    Extensions[0 /* eExtensions.UserExt */ ],
    Extensions[3 /* eExtensions.WebExt */ ],
    Extensions[5 /* eExtensions.OSExt */ ],
    Extensions[6 /* eExtensions.SdkExt */ ],
    Extensions[7 /* eExtensions.IntWebExt */ ],
    Extensions[8 /* eExtensions.UtcExt */ ],
    Extensions[9 /* eExtensions.LocExt */ ],
    Extensions[1 /* eExtensions.DeviceExt */ ],
    Extensions[2 /* eExtensions.TraceExt */ ],
    Extensions[11 /* eExtensions.DtExt */ ],
    Extensions[10 /* eExtensions.CloudExt */ ]
];
var PropertiesPlugin = /** @class */ (function(_super) {
    __extends(PropertiesPlugin, _super);

    function PropertiesPlugin() {
        var _this = _super.call(this) || this;
        _this.identifier = "SystemPropertiesCollector";
        _this.priority = 3;
        _this.version = '3.2.17';
        // Do not set default values here, set them in the _initDefaults() which is also called during teardown()
        var _context;
        var _properties;
        var _config;
        dynamicProto(PropertiesPlugin, _this, function(_self, _base) {
            _initDefaults();
            _self.initialize = function(coreConfig, core, extensions) {
                _base.initialize(coreConfig, core, extensions);
                _config = _self._getTelCtx().getExtCfg(_self.identifier);
                _context = new TelemetryContext(coreConfig, _config, core);
                if (core && core.setTraceCtx) {
                    core.setTraceCtx(_context.getTraceCtx());
                }
            };
            /**
             * Process the event and add part A fields to it.
             * @param event - The event that needs to be stored.
             * @param itemCtx - This is the context for the current request, ITelemetryPlugin instances
             * can optionally use this to access the current core instance or define / pass additional information
             * to later plugins (vs appending items to the telemetry item)
             */
            _self.processTelemetry = function(event, itemCtx) {
                setProcessTelemetryTimings(event, _self.identifier);
                itemCtx = _self._getTelCtx(itemCtx);
                var evtExt = event.ext = event.ext ? event.ext : {};
                event.data = event.data ? event.data : {};
                arrForEach(extensions, function(value) {
                    evtExt[value] = evtExt[value] || {};
                });
                if (_context) {
                    // Always apply the utc properties first as this sets the `ext.utc.eventFlags` which is required to tell
                    // the collector to mask some fields
                    _context.applyUtcContext(event);
                    _context.applyApplicationContext(event);
                    _context.applyUserContext(event);
                    _context.applyWebContext(event);
                    _context.applyOsContext(event);
                    _context.applySdkContext(event);
                    _context.applyIntWebContext(event);
                    _context.applyLocContext(event);
                    _context.applySessionContext(event);
                    _context.applyDeviceContext(event);
                    if (_config.enableApplicationInsightsTrace) {
                        _context.applyAITraceContext(event);
                    }
                    if (_config.enableDistributedTracing) {
                        _context.applyDistributedTraceContext(event);
                    }
                    _context.applyCloudContext(event);
                }
                // Delete empty ext fields
                arrForEach(objKeys(evtExt), function(key) {
                    if (objKeys(evtExt[key]).length === 0) {
                        delete evtExt[key];
                    }
                });
                // Add custom properties
                _addPropertiesIfAbsent(_properties, event.data);
                _self.processNext(event, itemCtx);
            };
            /**
             * Get properties context to override or specify specific part A properties
             * @returns the Context
             */
            _self.getPropertiesContext = function() {
                return _context;
            };
            /**
             * Sets a custom property to be sent with every event. IEventProperty can be used to tag the property as
             * pii or customer content.
             * @param name - The name of the property.
             * @param value - The context property's value.
             */
            _self.setProperty = function(name, value) {
                _properties[name] = value;
            };
            _self._doTeardown = function(unloadCtx, unloadState) {
                var core = (unloadCtx || {}).core();
                if (core && core.getTraceCtx && _context) {
                    var traceCtx = core.getTraceCtx(false);
                    if (traceCtx && traceCtx === _context.getTraceCtx()) {
                        core.setTraceCtx(null);
                    }
                }
                _initDefaults();
            };

            function _initDefaults() {
                _context = null;
                _properties = {};
            }

            function _addPropertiesIfAbsent(inputMap, outputMap) {
                if (inputMap) {
                    objForEachKey(inputMap, function(name, inputValue) {
                        if (!outputMap[name]) {
                            outputMap[name] = inputValue;
                        }
                    });
                }
            }
        });
        return _this;
    }
    // Removed Stub for PropertiesPlugin.prototype.initialize.
    // Removed Stub for PropertiesPlugin.prototype.processTelemetry.
    // Removed Stub for PropertiesPlugin.prototype.getPropertiesContext.
    // Removed Stub for PropertiesPlugin.prototype.setProperty.
    // This is a workaround for an IE8 bug when using dynamicProto() with classes that don't have any
    // non-dynamic functions or static properties/functions when using uglify-js to minify the resulting code.
    // this will be removed when ES3 support is dropped.
    PropertiesPlugin.__ieDyn = 1;

    return PropertiesPlugin;
}(BaseTelemetryPlugin));
export default PropertiesPlugin;
//# sourceMappingURL=PropertiesPlugin.js.map