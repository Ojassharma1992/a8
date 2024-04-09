/*
 * 1DS JS SDK Properties plugin, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
/**
 * Utc.ts
 * @author Hector Hernandez (hectorh)
 * @copyright Microsoft 2019
 */
/**
 * See details {@link https://www.osgwiki.com/wiki/Telemetry#De-Identification_of_Telemetry_Events | here}.
 * Client has hashed or dropped any PII information in the event. Vortex will hash any server-supplied PII fields such
 * as PUID or Global Device ID. This value is used to populate the `ext.utc.eventFlags`.
 * See https://1dsdocs.azurewebsites.net/schema/PartA/utc.html#eventflags and
 * further details https://www.osgwiki.com/wiki/Telemetry#De-Identification_of_Telemetry_Events.
 */
export var HASH_IDENTIFIERS_FLAG = 0x100000;
/**
 * See details {@link https://www.osgwiki.com/wiki/Telemetry#De-Identification_of_Telemetry_Events | here}.
 * Client has dropped any PII information in the event. Information contained within attached MSA token will not be inserted.
 * This value is used to populate the `ext.utc.eventFlags`.
 * See https://1dsdocs.azurewebsites.net/schema/PartA/utc.html#eventflags and
 * further details https://www.osgwiki.com/wiki/Telemetry#De-Identification_of_Telemetry_Events.
 */
export var DROP_IDENTIFIERS_FLAG = 0x200000;
/**
 * See details {@link https://www.osgwiki.com/wiki/Telemetry#De-Identification_of_Telemetry_Events | here}. Collector to scrub `ext.ingest.clientIp`
 * field stamped server-side. This takes precedence over both Hash Identifier and Drop Identifier flags above, so as long as this bit is set,
 * the client IP will be scrubbed as "xxx.xxx.xxx.*" for IPv4 and will not be dropped. The main use case for this flag is Interchange customers
 * that need to use OriginalMessage feature but wish not to have IP info in Geneva data store. For more details on this scenario, please see link
 * here: {@link https://eng.ms/docs/products/geneva/connectors/asimov_to_geneva/management#default-commonschema | 1DS Interchange Default CommonSchema }
 * See also {@link https://www.osgwiki.com/wiki/CommonSchema/flags | CommonSchema/flags}
 * @since 3.2.11
 */
export var SCRUB_IP_FLAG = 0x400000;
var Utc = /** @class */ (function() {
    function Utc(propertiesConfig) {
        var self = this;
        self.popSample = 100;
        self.eventFlags = 0;
        if (propertiesConfig.hashIdentifiers) {
            self.eventFlags = self.eventFlags | HASH_IDENTIFIERS_FLAG;
        }
        if (propertiesConfig.dropIdentifiers) {
            self.eventFlags = self.eventFlags | DROP_IDENTIFIERS_FLAG;
        }
        if (propertiesConfig.scrubIpOnly) {
            // set value when user didn't set values
            self.eventFlags = self.eventFlags | SCRUB_IP_FLAG;
        }
    }
    return Utc;
}());
export {
    Utc
};
//# sourceMappingURL=Utc.js.map