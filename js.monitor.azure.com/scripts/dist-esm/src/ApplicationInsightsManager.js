/*
 * 1DS JS SDK Shared Analytics, 3.2.17
 * Copyright (c) Microsoft and contributors. All rights reserved.
 * (Microsoft Internal Only)
 */
import {
    __extendsFn as __extends
} from "@microsoft/applicationinsights-shims";
/**
 * ApplInsightsManager.ts
 * @author Nev Wylie (newylie)
 * @copyright Microsoft 2019
 * Main class containing all the APIs.
 */
import dynamicProto from "@microsoft/dynamicproto-js";
import OverridePropertiesPlugin from "./OverridePropertiesPlugin";
import {
    AppInsightsCore,
    DiagnosticLogger,
    NotificationManager,
    PerfManager,
    _throwInternal,
    arrForEach,
    doPerf,
    dumpObj,
    hasOwnProperty,
    isFunction,
    objKeys
} from "@microsoft/1ds-core-js";
import {
    PostChannel
} from "@microsoft/1ds-post-js";
import {
    PropertiesPlugin
} from "@microsoft/1ds-properties-js";
var strDropInst = "_dropInst";
/**
 * @ignore
 */
function _copyObjProperties(dest, src) {
    if (src) {
        var keys = objKeys(src);
        for (var lp = 0; lp < keys.length; lp++) {
            var name_1 = keys[lp];
            if (!hasOwnProperty(dest, name_1)) {
                dest[name_1] = src[name_1];
            }
        }
    }
}
/**
 * @ignore
 */
function _isChannel(plugin) {
    // If the plugin hase the IChannelControls
    return (plugin.pause && plugin.teardown && plugin.flush);
}
/**
 * @ignore
 */
function _getEndpointUrl(identifier, config) {
    var endpointUrl = null;
    if (config) {
        if (config.endpointUrl) {
            endpointUrl = config.endpointUrl;
        }
        var extConfig = ((config.extensionConfig || {})[identifier]) || {};
        if (extConfig.overrideEndpointUrl) {
            endpointUrl = extConfig.overrideEndpointUrl;
        }
    }
    return endpointUrl;
}
/**
 * This is a child notification manager that will listen to events from the parent manager and resend the events
 * to it's listeners for the specific iKey that it was created for.
 */
var ChildNotificationManager = /** @class */ (function(_super) {
    __extends(ChildNotificationManager, _super);

    function ChildNotificationManager(iKey, parentManager) {
        var _this = _super.call(this) || this;
        dynamicProto(ChildNotificationManager, _this, function(_self, _base) {
            function _getEvents(events) {
                var iKeyEvents = [];
                if (events) {
                    arrForEach(events, function(evt) {
                        if (evt.iKey === iKey) {
                            iKeyEvents.push(evt);
                        }
                    });
                }
                return iKeyEvents;
            }

            function _hasListeners(eventName) {
                if (_self[eventName]) {
                    if (_self.listeners) {
                        for (var lp = 0; lp < _self.listeners.length; lp++) {
                            var listener = _self.listeners[lp];
                            if (listener && listener[eventName]) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }
            var eventListener = {
                eventsSent: function(events) {
                    if (_hasListeners("eventsSent")) {
                        var theEvents = _getEvents(events);
                        if (theEvents.length > 0) {
                            _self.eventsSent(theEvents);
                        }
                    }
                },
                eventsDiscarded: function(events, reason) {
                    if (_hasListeners("eventsDiscarded")) {
                        var theEvents = _getEvents(events);
                        if (theEvents.length > 0) {
                            _self.eventsDiscarded(theEvents, reason);
                        }
                    }
                },
                eventsSendRequest: function(sendReason, isAsync) {
                    if (_hasListeners("eventsSendRequest")) {
                        _self.eventsSendRequest(sendReason, isAsync);
                    }
                },
                perfEvent: function(perfEvent) {
                    if (_hasListeners("perfEvent")) {
                        _self.perfEvent(perfEvent);
                    }
                }
            };
            parentManager.addNotificationListener(eventListener);
        });
        return _this;
    }
    // This is a workaround for an IE8 bug when using dynamicProto() with classes that don't have any
    // non-dynamic functions or static properties/functions when using uglify-js to minify the resulting code.
    // this will be removed when ES3 support is dropped.
    ChildNotificationManager.__ieDyn = 1;

    return ChildNotificationManager;
}(NotificationManager));
var ApplicationInsightsManager = /** @class */ (function() {
    function ApplicationInsightsManager() {
        // Defaults that are only set during construction, but may also be set via setters
        // After calling "unload()" these values are persisted
        var _sharedCookieMgr = null;
        var _sharedPerfManager = null;
        // Default internal values (these values are set during construction and teardown)
        var _sharedConfig;
        var _sharedExtensions;
        var _sharedInstance;
        var _sharedNotificationManager;
        var _registeredPlugins;
        var _registeredChannels;
        var _instances;
        var _propsPlugin;
        var _postChannel;
        var _postChannelUrl;
        var _logger;
        var _notificationManager;
        var _perfManager;
        var _created;
        dynamicProto(ApplicationInsightsManager, this, function(_self) {
            _initDefaults();

            function _initDefaults() {
                _sharedConfig = {};
                _sharedExtensions = [];
                _sharedInstance = null;
                _sharedNotificationManager = null;
                _registeredPlugins = [];
                _registeredChannels = [];
                _instances = {};
                _propsPlugin = null;
                _postChannel = null;
                _postChannelUrl = null;
                _logger = null;
                _notificationManager = null;
                _perfManager = null;
                _created = false;
            }

            function _registerPlugin(plugin, defaultConfig) {
                if (defaultConfig === void 0) {
                    defaultConfig = null;
                }
                if (plugin) {
                    var register = _isChannel(plugin) ? _registeredChannels : _registeredPlugins;
                    register.push(plugin);
                    var identifier = plugin.identifier;
                    // Assigns the extensionConfig for the identifier if not already defined
                    _sharedConfig.extensionConfig[identifier] = _sharedConfig.extensionConfig[identifier] || {};
                    _copyObjProperties(_sharedConfig.extensionConfig[identifier], defaultConfig);
                }
                return plugin;
            }

            function _initializeSharedChannels() {
                var channelQueues = _sharedConfig.channels || [
                    []
                ];
                var postChannel = new PostChannel();
                var postChannelId = postChannel.identifier;
                // Check the defined channel queues
                var postFound = false;
                _postChannel = null;
                _postChannelUrl = null;
                arrForEach(channelQueues, function(channelQueue) {
                    arrForEach(channelQueue, function(channel) {
                        if (!isFunction(channel)) {
                            _registerPlugin(channel);
                            if (channel.identifier === postChannelId) {
                                postFound = true;
                                _postChannel = channel; // Need to cast to any as it complains about casting to IPostChannel
                            }
                        }
                    });
                });
                if (!postFound) {
                    channelQueues[0].push(postChannel);
                    // Register the default Shared PostChannel
                    _postChannel = _registerPlugin(postChannel, _sharedConfig.channelConfiguration);
                }
                _sharedConfig.channels = channelQueues;
            }

            function _initializeSharedExtensions(sharedExtensions) {
                _sharedExtensions = [];
                // Register the default Shared Properties Plugin
                _propsPlugin = _registerPlugin(new PropertiesPlugin(), _sharedConfig.propertyConfiguration);
                // Add the properties plugin
                _sharedExtensions.push(_propsPlugin);
                // Register all of the (optional) configuration extensions
                if (_sharedConfig.extensions) {
                    arrForEach(_sharedConfig.extensions, function(value) {
                        if (!isFunction(value)) {
                            _registerPlugin(value);
                        }
                    });
                }
                if (sharedExtensions) {
                    arrForEach(sharedExtensions, function(value) {
                        if (value && !isFunction(value)) {
                            _sharedExtensions.push(_registerPlugin(value));
                        }
                    });
                }
            }
            /**
             * Initializes the shared instance and shared plugins so that all properties are available.
             * @param iKey - The iKey to use (if available)
             */
            function _initializeSharedInstance(iKey) {
                if (!_sharedInstance) {
                    if (!_created) {
                        _throwInternal(_self.diagLog(), 2 /* eLoggingSeverity.WARNING */ , 520 /* _eExtendedInternalMessageId.SDKNotInitialized */ , "The Shared Manager is not yet created, the returned shared instance will be overwritten");
                    }
                    // Create a dummy instance so that the shared channels and plugins don't try and use
                    // the config from the first instance, use the provided iKey, default from config or a not defined string
                    // No telemetry is "expected" to be sent from this shared instance, but it would depend on the included
                    // set of plugins (the default won't)
                    var sharedInitConfig = _createMergedConfig(iKey || _sharedConfig.instrumentationKey || "_not_defined_", {});
                    _sharedNotificationManager = new NotificationManager();
                    _sharedInstance = new ApplicationInsights(_self, _self.diagLog(), _sharedNotificationManager);
                    _sharedInstance.initialize(sharedInitConfig, _sharedExtensions);
                    if (_sharedInstance.isInitialized()) {
                        if (_postChannel) {
                            _postChannelUrl = _getEndpointUrl(_postChannel.identifier, sharedInitConfig);
                        }
                    }
                    if (_sharedCookieMgr) {
                        _sharedInstance.setCookieMgr(_sharedCookieMgr);
                    }
                }
            }

            function _createMergedConfig(iKey, config) {
                var theConfig = {};
                // Set and replace the specific values we are managing
                theConfig.instrumentationKey = iKey;
                theConfig.channels = _createMergedChannels(config);
                _populateMergedConfigExtensions(theConfig);
                // Do a shallow copy merge and don't replace any existing properties
                _copyObjProperties(theConfig, config);
                _copyObjProperties(theConfig, _sharedConfig);
                return theConfig;
            }

            function _createMergedChannels(config) {
                var channels = [
                    []
                ];
                if (_sharedConfig.channels) {
                    arrForEach(_sharedConfig.channels, function(value, idx) {
                        if (!isFunction(value)) {
                            channels[idx] = channels[idx] || [];
                            channels[idx] = channels[idx].concat(value);
                        }
                    });
                }
                if (config && config.channels) {
                    arrForEach(config.channels, function(value, idx) {
                        if (!isFunction(value)) {
                            channels[idx] = channels[idx] || [];
                            channels[idx] = channels[idx].concat(value);
                        }
                    });
                }
                return channels;
            }

            function _populateMergedConfigExtensions(config) {
                var configExtensions = [];
                // Add the shared ones first (so the instance ones can override)
                if (_sharedConfig.extensions && _sharedConfig.extensions.length > 0) {
                    configExtensions = configExtensions.concat(_sharedConfig.extensions);
                }
                if (config && config.extensions && config.extensions.length > 0) {
                    configExtensions = configExtensions.concat(config.extensions);
                }
                if (configExtensions.length > 0) {
                    config.extensions = configExtensions;
                }
                config.extensionConfig = config.extensionConfig || {};
                _copyObjProperties(config.extensionConfig, _sharedConfig.extensionConfig);
            }

            function _createMergedExtensions(extensions) {
                var theExtensions = [];
                // Add the shared extensions first
                if (_sharedExtensions && _sharedExtensions.length > 0) {
                    theExtensions = theExtensions.concat(_sharedExtensions);
                }
                // Add the passed extensions
                if (extensions && extensions.length > 0) {
                    theExtensions = theExtensions.concat(extensions);
                }
                return theExtensions;
            }

            function _unloadInstance(iKey, isAsync, cb, cbTimeout) {
                var inst = _instances[iKey];
                if (inst) {
                    if (inst.inst && inst.inst.isInitialized()) {
                        inst.inst.unload(isAsync, function(state) {
                            cb && cb(iKey, state);
                        }, cbTimeout);
                    } else {
                        var unloadState = {
                            reason: 50 /* TelemetryUnloadReason.SdkUnload */ ,
                            isAsync: isAsync,
                            flushComplete: false
                        };
                        cb && cb(iKey, unloadState);
                    }
                }
            }
            _self.diagLog = function() {
                if (!_logger) {
                    _logger = new DiagnosticLogger(_sharedConfig);
                }
                return _logger;
            };
            _self.getCookieMgr = function() {
                // Make sure the shared plugins have been initialized
                _initializeSharedInstance();
                return _sharedCookieMgr || _sharedInstance.getCookieMgr();
            };
            _self.setCookieMgr = function(cookieMgr) {
                _sharedCookieMgr = cookieMgr;
                if (_sharedInstance) {
                    // If the shared instance is created then set it directly
                    _sharedInstance.setCookieMgr(cookieMgr);
                }
            };
            _self.getPerfMgr = function() {
                if (!_perfManager) {
                    if (_sharedConfig && _sharedConfig.enablePerfMgr) {
                        _perfManager = _sharedPerfManager || new PerfManager(_self.getNotifyMgr());
                    }
                }
                return _perfManager;
            };
            _self.setPerfMgr = function(perfMgr) {
                _sharedPerfManager = perfMgr;
                _perfManager = perfMgr;
            };
            _self.create = function(sharedConfig, sharedExtensions) {
                if (!_created) {
                    _sharedConfig = sharedConfig || {};
                    _sharedInstance = null;
                    _initializeSharedChannels();
                    _initializeSharedExtensions(sharedExtensions);
                    _created = true;
                } else {
                    _throwInternal(_self.diagLog(), 2 /* eLoggingSeverity.WARNING */ , 514 /* _eExtendedInternalMessageId.FailedToInitializeSDK */ , "Shared Manager has already been initialized.");
                }
            };
            _self.getInst = function(iKey) {
                return (_instances[iKey] || {}).inst;
            };
            _self.newInst = function(iKey, config, extensions) {
                var appInsights = _self.getInst(iKey);
                if (appInsights) {
                    _throwInternal(_self.diagLog(), 2 /* eLoggingSeverity.WARNING */ , 514 /* _eExtendedInternalMessageId.FailedToInitializeSDK */ , "Instance already exists for [" + iKey + "]");
                    return appInsights;
                }
                // Make sure the shared plugins have been initialized
                _initializeSharedInstance(iKey);
                if (_sharedInstance.isInitialized()) {
                    var theConfig = _createMergedConfig(iKey, config);
                    // Check that new instance isn't trying to change the endpointUrl
                    if (_postChannel) {
                        var identifier = _postChannel.identifier;
                        var configUrl = _getEndpointUrl(identifier, theConfig);
                        if (_postChannelUrl && configUrl && _postChannelUrl !== configUrl) {
                            _throwInternal(_self.diagLog(), 2 /* eLoggingSeverity.WARNING */ , 511 /* _eExtendedInternalMessageId.ErrorProvidedChannels */ , "The endpointUrl mismatch, shared Url [" + _postChannelUrl + "] is different from configured [" + configUrl + "] shared will be used!");
                        }
                    }
                    var notificationManager = new ChildNotificationManager(iKey, _sharedNotificationManager);
                    appInsights = new ApplicationInsights(_self, _self.diagLog(), notificationManager);
                    _instances[iKey] = {
                        iKey: iKey,
                        inst: appInsights,
                        notifyMgr: notificationManager
                    };
                    appInsights.setPerfMgr(_self.getPerfMgr());
                    appInsights.initialize(theConfig, _createMergedExtensions(extensions));
                    if (!appInsights.isInitialized()) {
                        _throwInternal(_self.diagLog(), 2 /* eLoggingSeverity.WARNING */ , 520 /* _eExtendedInternalMessageId.SDKNotInitialized */ , "Failed to initialize new instance!");
                        appInsights = null;
                        delete _instances[iKey];
                    }
                }
                return appInsights;
            };
            _self.getSharedPlugin = function(identifier) {
                // Make sure the shared plugins have been initialized
                _initializeSharedInstance();
                var plugin = null;
                var loadedPlugin = _sharedInstance.getPlugin(identifier);
                if (loadedPlugin) {
                    plugin = loadedPlugin.plugin;
                }
                return plugin;
            };
            _self.getPropertyManager = function() {
                // Make sure the shared plugins have been initialized
                _initializeSharedInstance();
                return _propsPlugin;
            };
            _self.getPostChannel = function() {
                // Make sure the shared plugins have been initialized
                _initializeSharedInstance();
                return _postChannel;
            };
            _self.getNotifyMgr = function() {
                if (!_notificationManager) {
                    _notificationManager = new NotificationManager();
                }
                return _notificationManager;
            };
            _self.unload = function(isAsync, unloadComplete, cbTimeout) {
                var keys = objKeys(_instances);
                var waiting = keys.length + 1;
                var defUnloadState = {
                    reason: 50 /* TelemetryUnloadReason.SdkUnload */ ,
                    isAsync: isAsync,
                    flushComplete: false
                };

                function _doUnload(iKey, unloadState) {
                    waiting--;
                    if (waiting === 0) {
                        _initDefaults();
                        unloadComplete && unloadComplete(unloadState);
                    }
                }
                if (_sharedInstance) {
                    arrForEach(keys, function(instKey) {
                        _unloadInstance(instKey, isAsync, function(key, state) {
                            _doUnload(key, state);
                        }, cbTimeout);
                    });
                    if (_sharedInstance.isInitialized()) {
                        _sharedInstance.unload(isAsync, function(state) {
                            defUnloadState = state;
                            _doUnload(null, defUnloadState);
                        }, cbTimeout);
                        _sharedInstance = null;
                    }
                }
                _doUnload(null, defUnloadState);
            };
            // Internal hook so when if the instance is manually unloaded it's also removed from the manager
            _self[strDropInst] = function(iKey) {
                // Remove this instance as we are about to unload it
                if (iKey && _instances.iKey) {
                    delete _instances[iKey];
                }
            };
        });
    }
    // Removed Stub for ApplicationInsightsManager.prototype.getNotifyMgr.
    // Removed Stub for ApplicationInsightsManager.prototype.getCookieMgr.
    // Removed Stub for ApplicationInsightsManager.prototype.setCookieMgr.
    // Removed Stub for ApplicationInsightsManager.prototype.getPerfMgr.
    // Removed Stub for ApplicationInsightsManager.prototype.setPerfMgr.
    // Removed Stub for ApplicationInsightsManager.prototype.unload.
    // This is a workaround for an IE8 bug when using dynamicProto() with classes that don't have any
    // non-dynamic functions or static properties/functions when using uglify-js to minify the resulting code.
    // this will be removed when ES3 support is dropped.
    ApplicationInsightsManager.__ieDyn = 1;

    return ApplicationInsightsManager;
}());
export default ApplicationInsightsManager;
var ApplicationInsights = /** @class */ (function(_super) {
    __extends(ApplicationInsights, _super);

    function ApplicationInsights(manager, logger, notificationManager) {
        var _this = _super.call(this) || this;
        var _manager = manager;
        var _overrideProperties;
        dynamicProto(ApplicationInsights, _this, function(_self, _base) {
            _self.getSharedPropertyManager = function() {
                return _manager.getPropertyManager();
            };
            _self.getSharedPostChannel = function() {
                return _manager.getPostChannel();
            };
            _self.getOverridePropertyManager = function() {
                return _overrideProperties;
            };
            _self.initialize = function(config, extensions) {
                doPerf(_self, function() {
                    return "ApplicationInsights:initialize";
                }, function() {
                    _overrideProperties = new OverridePropertiesPlugin();
                    var plugins = [_overrideProperties];
                    if (extensions) {
                        plugins = plugins.concat(extensions);
                    }
                    config.extensionConfig = config.extensionConfig || [];
                    // Allow the passed propertyConfiguration to be used for the override only
                    var overridePropConfig = config.propertyConfiguration || {};
                    if (config.propertyConfiguration) {
                        // Remove the node from the config so it doesn't get confused with the shared one
                        delete config.propertyConfiguration;
                    }
                    config.extensionConfig[_overrideProperties.identifier] = overridePropConfig;
                    try {
                        _base.initialize(config, plugins, logger, notificationManager);
                    } catch (error) {
                        _throwInternal(_self.logger, 1 /* eLoggingSeverity.CRITICAL */ , 514 /* _eExtendedInternalMessageId.FailedToInitializeSDK */ , "Failed to initialize SDK." + dumpObj(error));
                    }
                }, function() {
                    return ({
                        config: config,
                        extensions: extensions
                    });
                });
            };
            _self.unload = function(isAsync, unloadComplete, cbTimeout) {
                // Tell the manager that this instance is being unloaded and it should drop all references
                _manager[strDropInst] && _manager[strDropInst]((_self.config || {}).instrumentationKey);
                _base.unload(isAsync, unloadComplete, cbTimeout);
            };
        });
        return _this;
    }
    // Removed Stub for ApplicationInsights.prototype.initialize.
    // Removed Stub for ApplicationInsights.prototype.unload.
    // This is a workaround for an IE8 bug when using dynamicProto() with classes that don't have any
    // non-dynamic functions or static properties/functions when using uglify-js to minify the resulting code.
    // this will be removed when ES3 support is dropped.
    ApplicationInsights.__ieDyn = 1;

    return ApplicationInsights;
}(AppInsightsCore));
export {
    ApplicationInsights
};
//# sourceMappingURL=ApplicationInsightsManager.js.map