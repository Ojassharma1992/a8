/*
 * 1DS JS SDK Properties plugin, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
/**
 * User.ts
 * @author Hector Hernandez (hectorh)
 * @copyright Microsoft 2019
 */
import dynamicProto from "@microsoft/dynamicproto-js";
import {
    getCookieValue,
    getISOString,
    isUndefined,
    newId,
    objDefineAccessors,
    safeGetCookieMgr
} from "@microsoft/1ds-core-js";
var strSetLocalId = "setLocalId";

function _getLocalId() {
    return this.getLocalId();
}

function _setLocalId(value) {
    this[strSetLocalId](value);
}
var User = /** @class */ (function() {
    function User(coreConfig, propertiesConfig, core) {
        var _propertiesConfig = propertiesConfig;
        var _customLocalId;
        var _cookieMgr = safeGetCookieMgr(core, coreConfig);
        dynamicProto(User, this, function(_self) {
            // Add MUID in user localId
            if (_cookieMgr && _cookieMgr.isEnabled()) {
                _populateMuidFromCookie();
                if (_propertiesConfig.enableApplicationInsightsUser) {
                    // get userId or create new one if none exists
                    var aiUser = getCookieValue(_cookieMgr, User.userCookieName);
                    if (aiUser) {
                        var params = aiUser.split(User.cookieSeparator);
                        if (params.length > 0) {
                            _self.id = params[0];
                        }
                    }
                    if (!_self.id) {
                        _self.id = newId((coreConfig && !isUndefined(coreConfig.idLength)) ? coreConfig.idLength : 22);
                        var acqStr = getISOString(new Date());
                        _self.accountAcquisitionDate = acqStr;
                        // without expiration, cookies expire at the end of the session
                        // set it to 365 days from now
                        // 365 * 24 * 60 * 60 * 1000 = 31536000
                        var newCookie = [_self.id, acqStr];
                        var cookieDomain = _propertiesConfig.cookieDomain ? _propertiesConfig.cookieDomain : undefined;
                        _cookieMgr.set(User.userCookieName, newCookie.join(User.cookieSeparator), 31536000, cookieDomain);
                    }
                }
            }
            // Add user language
            if (typeof navigator !== "undefined") {
                var nav = navigator;
                _self.locale = nav.userLanguage || nav.language;
            }
            _self.getLocalId = function() {
                if (_customLocalId) {
                    return _customLocalId;
                }
                return _populateMuidFromCookie();
            };
            _self[strSetLocalId] = function(value) {
                _customLocalId = value;
            };

            function _populateMuidFromCookie() {
                // Only add default local ID is hash or drop config are not enabled
                if (!_propertiesConfig.hashIdentifiers && !_propertiesConfig.dropIdentifiers) {
                    var muidValue = getCookieValue(_cookieMgr, "MUID");
                    if (muidValue) {
                        _customLocalId = "t:" + muidValue;
                    }
                }
                return _customLocalId;
            }
        });
    }
    // Removed Stub for User.prototype.getLocalId.
    // Removed Stub for User.prototype.setLocalId.
    User.cookieSeparator = "|";
    User.userCookieName = "ai_user";
    /**
     * Static constructor, attempt to create accessors
     */
    User._staticInit = (function() {
        // Dynamically create get/set property accessors
        objDefineAccessors(User.prototype, "localId", _getLocalId, _setLocalId);
    })();
    return User;
}());
export {
    User
};
//# sourceMappingURL=User.js.map