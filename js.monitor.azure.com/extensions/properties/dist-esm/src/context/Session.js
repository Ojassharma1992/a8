/*
 * 1DS JS SDK Properties plugin, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
/**
 * Session.ts
 * @copyright Microsoft 2019
 */
import dynamicProto from "@microsoft/dynamicproto-js";
import {
    isString,
    objDefineAccessors
} from "@microsoft/1ds-core-js";

function _getId() {
    return this.getId();
}

function _setId(id) {
    this.setId(id);
}
var Session = /** @class */ (function() {
    function Session() {
        dynamicProto(Session, this, function(_self) {
            _self.setId = function(id) {
                _self.customId = id;
            };
            _self.getId = function() {
                if (isString(_self.customId)) {
                    return _self.customId;
                } else {
                    return _self.automaticId;
                }
            };
        });
    }
    // Removed Stub for Session.prototype.setId.
    // Removed Stub for Session.prototype.getId.
    /**
     * Static constructor, attempt to create accessors
     */
    Session._staticInit = (function() {
        // Dynamically create get/set property accessors
        objDefineAccessors(Session.prototype, "id", _getId, _setId);
    })();
    return Session;
}());
export {
    Session
};
//# sourceMappingURL=Session.js.map