/*
 * 1DS JS SDK Shared Analytics, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
import {
    __extendsFn as __extends
} from "@microsoft/applicationinsights-shims";
/**
 * OverridePropertiesPlugin.ts
 * @author Nev Wylie (newylie)
 * @copyright Microsoft 2019
 */
import dynamicProto from "@microsoft/dynamicproto-js";
import {
    BaseTelemetryPlugin,
    setProcessTelemetryTimings
} from "@microsoft/1ds-core-js";
import {
    OverrideContext
} from "./Override/OverrideContext";
var OverridePropertiesPlugin = /** @class */ (function(_super) {
    __extends(OverridePropertiesPlugin, _super);

    function OverridePropertiesPlugin() {
        var _this = _super.call(this) || this;
        _this.identifier = "OverridePropertiesPlugin";
        _this.priority = 4;
        _this.version = '3.2.17';
        var _context = null;
        dynamicProto(OverridePropertiesPlugin, _this, function(_self, _base) {
            _self.initialize = function(coreConfig, core, extensions) {
                _base.initialize(coreConfig, core, extensions);
                _self._baseInit(coreConfig, core, extensions);
            };
            /**
             * Process the event and add part A fields to it.
             * @param event - The event that needs to be stored.
             * @param itemCtx - This is the context for the current request, ITelemetryPlugin instances
             * can optionally use this to access the current core instance or define / pass additional information
             * to later plugins (vs appending items to the telemetry item)
             */
            _self.processTelemetry = function(item, itemCtx) {
                setProcessTelemetryTimings(item, _this.identifier);
                itemCtx = _self._getTelCtx(itemCtx);
                var context = _self.getOverrideContext();
                if (context) {
                    context.applyOverrides(item, itemCtx);
                }
                _self.processNext(item, itemCtx);
            };
            _self._baseInit = function(coreConfig, core, extensions) {
                _context = new OverrideContext(coreConfig, _this._getTelCtx().getExtCfg(_this.identifier), core);
            };
            _self.setProperty = function(name, value) {
                if (_context) {
                    _context.data.setProperty(name, value);
                }
            };
            _self.getOverrideContext = function() {
                return _context;
            };
        });
        return _this;
    }
    // Removed Stub for OverridePropertiesPlugin.prototype.initialize.
    // Removed Stub for OverridePropertiesPlugin.prototype.processTelemetry.
    // This is a workaround for an IE8 bug when using dynamicProto() with classes that don't have any
    // non-dynamic functions or static properties/functions when using uglify-js to minify the resulting code.
    // this will be removed when ES3 support is dropped.
    OverridePropertiesPlugin.__ieDyn = 1;

    return OverridePropertiesPlugin;
}(BaseTelemetryPlugin));
export default OverridePropertiesPlugin;
//# sourceMappingURL=OverridePropertiesPlugin.js.map