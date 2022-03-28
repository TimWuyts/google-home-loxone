"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSmartHome = void 0;
var googleapis_1 = require("googleapis");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var capability_handler_1 = require("./capabilities/capability-handler");
var uuid = require('uuid');
var GoogleSmartHome = /** @class */ (function () {
    function GoogleSmartHome(config, components, auth, statesEvents, jwtConfig, jwtPath) {
        this.config = config;
        this.jwtConfig = jwtConfig;
        this.jwtPath = jwtPath;
        this.auth = auth;
        this.handlers = new capability_handler_1.Handlers();
        this.components = components;
        this.statesEvents = statesEvents;
    }
    GoogleSmartHome.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var auth, client, homegraph;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        auth = new googleapis_1.google.auth.GoogleAuth({ keyFile: this.jwtPath, scopes: ['https://www.googleapis.com/auth/homegraph'] });
                        return [4 /*yield*/, auth.getClient()];
                    case 1:
                        client = _a.sent();
                        homegraph = googleapis_1.google.homegraph({ version: 'v1', auth: client });
                        if (!!this.config.testMode) return [3 /*break*/, 3];
                        return [4 /*yield*/, homegraph.devices.requestSync({ requestBody: { agentUserId: this.config.agentUserId, async: false } })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        // Listening for loxone devices events
                        this.subscribeStates(this.statesEvents).subscribe({
                            next: function (states) { return homegraph.devices.reportStateAndNotification({ requestBody: states }); }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    GoogleSmartHome.prototype.subscribeStates = function (statesEvents) {
        var _this = this;
        return statesEvents.pipe((0, operators_1.buffer)((0, rxjs_1.interval)(1000)), (0, operators_1.filter)(function (componentsStates) { return componentsStates.length > 0; }), (0, operators_1.mergeMap)(function (componentsStates) {
            return (0, rxjs_1.from)(componentsStates).pipe((0, operators_1.mergeMap)(function (component) { return component.getStates().pipe((0, operators_1.map)(function (state) {
                var response = {};
                response[component.id] = state;
                return response;
            })); }), (0, operators_1.toArray)(), (0, operators_1.map)(function (result) {
                var states = result.reduce(function (acc, cur) {
                    return Object.assign({}, acc, cur);
                }, {});
                return {
                    requestId: uuid.v4(),
                    agentUserId: _this.config.agentUserId,
                    payload: {
                        devices: {
                            states: states
                        }
                    }
                };
            }));
        }));
    };
    GoogleSmartHome.prototype.handler = function (data, request) {
        var _this = this;
        var authToken = this.auth.checkToken(request);
        return authToken.pipe((0, operators_1.mergeMap)(function (registered) {
            if (!registered) {
                return (0, rxjs_1.of)({
                    errorCode: 'authFailure'
                });
            }
            var input = data.inputs[0];
            var intent = input.intent;
            if (!intent) {
                return (0, rxjs_1.of)({
                    errorCode: 'notSupported'
                });
            }
            switch (intent) {
                case 'action.devices.SYNC':
                    console.log('post /smarthome SYNC');
                    return _this.sync(data.requestId);
                case 'action.devices.QUERY':
                    console.log('post /smarthome QUERY');
                    return _this.query(input.payload, data.requestId);
                case 'action.devices.EXECUTE':
                    console.log('post /smarthome EXECUTE');
                    return _this.exec(input.payload, data.requestId);
                case 'action.devices.DISCONNECT':
                    // TODO
                    return (0, rxjs_1.of)({});
                default:
                    return (0, rxjs_1.of)({
                        errorCode: 'notSupported'
                    });
            }
        }));
    };
    GoogleSmartHome.prototype.sync = function (requestId) {
        var devices = Object.values(this.components.getComponent())
            .map(function (component) { return component.getSync(); });
        return (0, rxjs_1.of)({
            requestId: requestId,
            payload: {
                agentUserId: this.config.agentUserId,
                devices: devices
            }
        });
    };
    // Retrieve states of multiple devices
    GoogleSmartHome.prototype.query = function (request, requestId) {
        var _this = this;
        // We iterate trough devices
        return (0, rxjs_1.from)(request.devices).pipe((0, operators_1.mergeMap)(function (device) {
            // Check if we have the device in factory
            if (!_this.components.getComponent().hasOwnProperty(device.id)) {
                return (0, rxjs_1.of)({
                    id: device.id,
                    errorCode: 'deviceNotFound'
                });
            }
            return _this.components.getComponent()[device.id].getStates().pipe((0, operators_1.map)(function (states) {
                return {
                    id: device.id,
                    states: states
                };
            }));
        }), (0, operators_1.toArray)(), (0, operators_1.map)(function (result) {
            var devices = result.reduce(function (acc, cur) {
                if (cur['states']) {
                    acc[cur['id']] = cur['states'];
                }
                if (cur['errorCode']) {
                    acc[cur['id']] = {
                        'errorCode': cur['errorCode']
                    };
                }
                return acc;
            }, {});
            return {
                requestId: requestId,
                payload: {
                    devices: devices
                }
            };
        }));
    };
    GoogleSmartHome.prototype.exec = function (request, requestId) {
        var _this = this;
        return (0, rxjs_1.from)(request.commands).pipe((0, operators_1.mergeMap)(function (command) { return _this.handleCommand(command); }), (0, operators_1.toArray)(), (0, operators_1.map)(function (result) {
            return {
                requestId: requestId,
                payload: {
                    commands: result
                }
            };
        }));
    };
    GoogleSmartHome.prototype.handleCommand = function (command) {
        var _this = this;
        // Iterate trough devices
        return (0, rxjs_1.from)(command.devices).pipe((0, operators_1.mergeMap)(function (device) {
            // Check if we have the device in factory
            if (!_this.components.getComponent().hasOwnProperty(device.id)) {
                return (0, rxjs_1.of)({
                    ids: [device.id],
                    status: 'ERROR',
                    errorCode: 'deviceNotFound'
                });
            }
            var component = _this.components.getComponent()[device.id];
            if (_this.config.log) {
                console.log('Component found');
            }
            // Now execute all command into the device
            return (0, rxjs_1.from)(command.execution).pipe((0, operators_1.mergeMap)(function (execution) {
                var componentHandler = _this.handlers.getHandler(execution.command);
                if (componentHandler === undefined) {
                    // If we can't found the device, return false
                    return (0, rxjs_1.of)(false);
                }
                return componentHandler.handleCommands(component, execution.command, execution.params);
            }), (0, operators_1.catchError)(function (err) {
                console.error('ERROR', err);
                return (0, rxjs_1.of)(false);
            }), (0, operators_1.mergeMap)(function (succeed) {
                // Can't find the handler, return not supported
                if (!succeed) {
                    return (0, rxjs_1.of)({
                        ids: [device.id],
                        status: 'ERROR',
                        errorCode: 'notSupported'
                    });
                }
                // Call state on component and merge them
                return component.getStates().pipe((0, operators_1.map)(function (states) {
                    return {
                        ids: [device.id],
                        status: 'SUCCESS',
                        states: states
                    };
                }));
            }));
        }));
    };
    return GoogleSmartHome;
}());
exports.GoogleSmartHome = GoogleSmartHome;
//# sourceMappingURL=google-smart-home.js.map