/*
 * 1DS JS SDK Properties plugin, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
/**
 * AITrace.ts
 * @author Hector Hernandez (hectorh)
 * @copyright Microsoft 2019
 */
import {
    generateW3CId,
    getLocation
} from "@microsoft/1ds-core-js";
var Trace = /** @class */ (function() {
    function Trace(propertiesConfig, id, parentId, name) {
        var self = this;
        self.traceId = id || generateW3CId();
        if (propertiesConfig.enableDistributedTracing && !parentId) {
            // When dt is enabled, both the traceId and spanId are required
            parentId = generateW3CId().substring(0, 16);
        }
        self.parentId = parentId;
        if (propertiesConfig.enableApplicationInsightsTrace) {
            self.name = name;
            var loc = getLocation();
            if (loc && loc.pathname) {
                self.name = loc.pathname;
            }
        }
    }
    return Trace;
}());
export {
    Trace
};
//# sourceMappingURL=Trace.js.map