/*
 * 1DS JS SDK Properties plugin, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
/**
 * IntWeb.ts
 * @author Hector Hernandez (hectorh)
 * @copyright Microsoft 2019
 */
import dynamicProto from "@microsoft/dynamicproto-js";
import {
    getCookieValue,
    objDefineAccessors,
    safeGetCookieMgr
} from "@microsoft/1ds-core-js";

function _getMsfpc() {
    return this.getMsfpc();
}

function _getAnid() {
    return this.getAnid();
}
var IntWeb = /** @class */ (function() {
    function IntWeb(propertiesConfig, core) {
        var _cookieMgr = safeGetCookieMgr(core);
        dynamicProto(IntWeb, this, function(_self) {
            if (propertiesConfig.serviceName) {
                _self.serviceName = propertiesConfig.serviceName;
            }
            _self.getMsfpc = function() {
                return getCookieValue(_cookieMgr, "MSFPC");
            };
            _self.getAnid = function() {
                return getCookieValue(_cookieMgr, "ANON").slice(0, 34);
            };
        });
    }
    // Removed Stub for IntWeb.prototype.getMsfpc.
    // Removed Stub for IntWeb.prototype.getAnid.
    /**
     * Static constructor, attempt to create accessors
     */
    IntWeb._staticInit = (function() {
        // Dynamically create get/set property accessors
        var proto = IntWeb.prototype;
        objDefineAccessors(proto, "msfpc", _getMsfpc);
        objDefineAccessors(proto, "anid", _getAnid);
    })();
    return IntWeb;
}());
export {
    IntWeb
};
//# sourceMappingURL=IntWeb.js.map