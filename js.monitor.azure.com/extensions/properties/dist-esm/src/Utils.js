/*
 * 1DS JS SDK Properties plugin, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
/**
 * Utils.ts
 * @author  Abhilash Panwar (abpanwar) Hector Hernandez (hectorh)
 * @copyright Microsoft 2018
 * File containing utility functions.
 */
import {
    getGlobal,
    isFunction,
    _throwInternal
} from "@microsoft/1ds-core-js";
var _canUseLocalStorage;
/**
 *  Check if the browser supports local storage.
 *
 *  @returns {boolean} True if local storage is supported.
 */
export function canUseLocalStorage() {
    if (_canUseLocalStorage === undefined) {
        _canUseLocalStorage = !!_getVerifiedStorageObject(0 /* StorageType.LocalStorage */ );
    }
    return _canUseLocalStorage;
}
/**
 * Gets the localStorage object if available
 * @returns Returns the storage object if available else returns null
 */
function _getLocalStorageObject() {
    if (canUseLocalStorage()) {
        return _getVerifiedStorageObject(0 /* StorageType.LocalStorage */ );
    }
    return null;
}
/**
 * Tests storage object (localStorage or sessionStorage) to verify that it is usable
 * More details here: https://mathiasbynens.be/notes/localstorage-pattern
 * @param storageType - Type of storage
 * @returns Returns storage object verified that it is usable
 */
function _getVerifiedStorageObject(storageType) {
    var storage = null;
    var fail;
    var uid;
    try {
        var global_1 = getGlobal();
        if (!global_1) {
            return null;
        }
        uid = new Date();
        storage = storageType === 0 /* StorageType.LocalStorage */ ? global_1.localStorage : global_1.sessionStorage;
        if (storage && isFunction(storage.setItem)) {
            storage.setItem(uid, uid);
            fail = storage.getItem(uid) !== uid;
            storage.removeItem(uid);
            if (fail) {
                storage = null;
            }
        }
    } catch (exception) {
        storage = null;
    }
    return storage;
}
/**
 *  Set the contents of an object in the browser's local storage
 *
 *  @param name - the name of the object to set in storage
 *  @param data - the contents of the object to set in storage
 *  @returns True if the storage object could be written.
 */
export function setStorage(logger, name, data) {
    var storage = _getLocalStorageObject();
    if (storage !== null) {
        try {
            storage.setItem(name, data);
            return true;
        } catch (e) {
            _canUseLocalStorage = false;
            _throwInternal(logger, 1 /* eLoggingSeverity.CRITICAL */ , 504 /* _eExtendedInternalMessageId.BrowserCannotWriteLocalStorage */ , "Browser failed write to local storage. " + e);
        }
    }
    return false;
}
/**
 *  Get an object from the browser's local storage
 *
 *  @param name - the name of the object to get from storage
 *  @returns The contents of the storage object with the given name. Null if storage is not supported.
 */
export function getStorage(logger, name) {
    var storage = _getLocalStorageObject();
    if (storage !== null) {
        try {
            return storage.getItem(name);
        } catch (e) {
            _canUseLocalStorage = false;
            _throwInternal(logger, 1 /* eLoggingSeverity.CRITICAL */ , 503 /* _eExtendedInternalMessageId.BrowserCannotReadLocalStorage */ , "Browser failed read of local storage. " + e);
        }
    }
    return null;
}
//# sourceMappingURL=Utils.js.map