/*
 * 1DS JS SDK Properties plugin, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
/**
 * SessionManager.ts
 * @author Hector Hernandez (hectorh)
 * @copyright Microsoft 2019
 */
import dynamicProto from "@microsoft/dynamicproto-js";
import {
    _throwInternal,
    createGuid,
    isBoolean,
    isFunction,
    isUndefined,
    newId,
    safeGetCookieMgr,
    safeGetLogger
} from "@microsoft/1ds-core-js";
import {
    canUseLocalStorage,
    getStorage,
    setStorage
} from "./Utils";
import {
    Session
} from "./context/Session";
var cookieNameConst = "ai_session";
var SessionManager = /** @class */ (function() {
    function SessionManager(core, propConfig) {
        var _cookieUpdatedTimestamp;
        var _logger = safeGetLogger(core);
        var cookieMgr = safeGetCookieMgr(core);
        var _storageNamePrefix;
        dynamicProto(SessionManager, this, function(_self) {
            var functionalConfig = getDefaultConfig(propConfig);
            if (!isFunction(propConfig.sessionExpirationMs)) {
                functionalConfig.sessionExpirationMs = function() {
                    return SessionManager.acquisitionSpan;
                };
            }
            if (!isFunction(propConfig.sessionRenewalMs)) {
                functionalConfig.sessionRenewalMs = function() {
                    return SessionManager.renewalSpan;
                };
            }
            _self.config = functionalConfig;
            _storageNamePrefix = function() {
                return _self.config.namePrefix && _self.config.namePrefix() ? cookieNameConst + _self.config.namePrefix() : cookieNameConst;
            };
            _self.automaticSession = new Session();
            _self.update = function() {
                if (!_self.automaticSession.getId()) {
                    _initializeAutomaticSession();
                }
                var autoSession = _self.automaticSession;
                var config = _self.config;
                var now = new Date().getTime();
                var acquisitionExpired = now - autoSession.acquisitionDate > config.sessionExpirationMs();
                var renewalExpired = now - autoSession.renewalDate > config.sessionRenewalMs();
                // renew if acquisitionSpan or renewalSpan has ellapsed
                if (acquisitionExpired || renewalExpired) {
                    // update automaticSession so session state has correct id
                    _renew();
                } else {
                    // do not update the cookie more often than cookieUpdateInterval
                    var cookieUpdatedTimestamp = _cookieUpdatedTimestamp;
                    if (!cookieUpdatedTimestamp || now - cookieUpdatedTimestamp > SessionManager.cookieUpdateInterval) {
                        autoSession.renewalDate = now;
                        _setCookie(autoSession.getId(), autoSession.acquisitionDate, autoSession.renewalDate);
                    }
                }
            };
            _self.backup = function() {
                var automaticSession = _self.automaticSession;
                _setStorage(automaticSession.getId(), automaticSession.acquisitionDate, automaticSession.renewalDate);
            };
            /**
             * @ignore
             * Create functional configs if value is provided, else SessionManager provides the defaults
             * @param config - Property configuration
             */
            function getDefaultConfig(config) {
                return {
                    sessionRenewalMs: config.sessionRenewalMs && (function() {
                        return config.sessionRenewalMs;
                    }),
                    sessionExpirationMs: config.sessionExpirationMs && (function() {
                        return config.sessionExpirationMs;
                    }),
                    cookieDomain: config.cookieDomain && (function() {
                        return config.cookieDomain;
                    }),
                    namePrefix: config.namePrefix && (function() {
                        return config.namePrefix;
                    }),
                    sessionAsGuid: (function() {
                        return config.sessionAsGuid;
                    }),
                    idLength: (function() {
                        return config.idLength ? config.idLength : 22;
                    })
                };
            }
            /**
             * @ignore
             * Use config.namePrefix + ai_session cookie data or local storage data (when the cookie is unavailable) to
             * initialize the automatic session.
             */
            function _initializeAutomaticSession() {
                var cookie = cookieMgr.get(_storageNamePrefix());
                if (cookie && isFunction(cookie.split)) {
                    _initializeAutomaticSessionWithData(cookie);
                } else {
                    // There's no cookie, but we might have session data in local storage
                    // This can happen if the session expired or the user actively deleted the cookie
                    // We only want to recover data if the cookie is missing from expiry. We should respect the user's wishes if the cookie was deleted actively.
                    // The User class handles this for us and deletes our local storage object if the persistent user cookie was removed.
                    var storage = getStorage(_logger, _storageNamePrefix());
                    if (storage) {
                        _initializeAutomaticSessionWithData(storage);
                    }
                }
                if (!_self.automaticSession.getId()) {
                    _renew();
                }
            }
            /**
             * @ignore
             * Extract id, aquisitionDate, and renewalDate from an ai_session payload string and
             * use this data to initialize automaticSession.
             *
             * @param sessionData - The string stored in an ai_session cookie or local storage backup
             */
            function _initializeAutomaticSessionWithData(sessionData) {
                var automaticSession = _self.automaticSession;
                var params = sessionData.split("|");
                if (params.length > 0) {
                    automaticSession.setId(params[0]);
                }
                try {
                    if (params.length > 1) {
                        var acq = +params[1];
                        automaticSession.acquisitionDate = +new Date(acq);
                        automaticSession.acquisitionDate = automaticSession.acquisitionDate > 0 ? automaticSession.acquisitionDate : 0;
                    }
                    if (params.length > 2) {
                        var renewal = +params[2];
                        automaticSession.renewalDate = +new Date(renewal);
                        automaticSession.renewalDate = automaticSession.renewalDate > 0 ? automaticSession.renewalDate : 0;
                    }
                } catch (e) {
                    _throwInternal(_logger, 1 /* eLoggingSeverity.CRITICAL */ , 510 /* _eExtendedInternalMessageId.ErrorParsingAISessionCookie */ , "Error parsing ai_session cookie, session will be reset: " + e);
                }
                if (automaticSession.renewalDate === 0) {
                    _throwInternal(_logger, 2 /* eLoggingSeverity.WARNING */ , 517 /* _eExtendedInternalMessageId.SessionRenewalDateIsZero */ , "AI session renewal date is 0, session will be reset.");
                }
            }

            function _renew() {
                var automaticSession = _self.automaticSession;
                var now = new Date().getTime();
                var sessionAsGuid = _self.config.sessionAsGuid();
                if (!isUndefined(sessionAsGuid) && sessionAsGuid) {
                    if (!isBoolean(sessionAsGuid)) {
                        automaticSession.setId(createGuid(sessionAsGuid));
                    } else {
                        automaticSession.setId(createGuid());
                    }
                } else {
                    automaticSession.setId(newId((functionalConfig && functionalConfig.idLength) ? functionalConfig.idLength() : 22));
                }
                automaticSession.acquisitionDate = now;
                automaticSession.renewalDate = now;
                _setCookie(automaticSession.getId(), automaticSession.acquisitionDate, automaticSession.renewalDate);
                // If this browser does not support local storage, fire an internal log to keep track of it at this point
                if (!canUseLocalStorage()) {
                    _throwInternal(_logger, 2 /* eLoggingSeverity.WARNING */ , 505 /* _eExtendedInternalMessageId.BrowserDoesNotSupportLocalStorage */ , "Browser does not support local storage. Session durations will be inaccurate.");
                }
            }

            function _setCookie(guid, acq, renewal) {
                // Set cookie to expire after the session expiry time passes or the session renewal deadline, whichever is sooner
                // Expiring the cookie will cause the session to expire even if the user isn't on the page
                var acquisitionExpiry = acq + _self.config.sessionExpirationMs();
                var renewalExpiry = renewal + _self.config.sessionRenewalMs();
                var cookieExpiry = new Date();
                var cookie = [guid, acq, renewal];
                if (acquisitionExpiry < renewalExpiry) {
                    cookieExpiry.setTime(acquisitionExpiry);
                } else {
                    cookieExpiry.setTime(renewalExpiry);
                }
                var cookieDomain = _self.config.cookieDomain ? _self.config.cookieDomain() : null;
                cookieMgr.set(_storageNamePrefix(), cookie.join("|") + ";expires=" + cookieExpiry.toUTCString(), null, cookieDomain);
                _cookieUpdatedTimestamp = new Date().getTime();
            }

            function _setStorage(guid, acq, renewal) {
                // Keep data in local storage to retain the last session id, allowing us to cleanly end the session when it expires
                // Browsers that don't support local storage won't be able to end sessions cleanly from the client
                // The server will notice this and end the sessions itself, with loss of accurate session duration
                setStorage(_logger, _storageNamePrefix(), [guid, acq, renewal].join("|"));
            }
        });
    }
    // Removed Stub for SessionManager.prototype.update.
    // Removed Stub for SessionManager.prototype.backup.
    SessionManager.acquisitionSpan = 86400000; // 24 hours in ms
    SessionManager.renewalSpan = 1800000; // 30 minutes in ms
    SessionManager.cookieUpdateInterval = 60000; // 1 minute in ms
    return SessionManager;
}());
export {
    SessionManager
};
//# sourceMappingURL=SessionManager.js.map