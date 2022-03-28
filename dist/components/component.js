"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
var index_1 = require("rxjs/index");
var fromArray_1 = require("rxjs/internal/observable/fromArray");
var operators_1 = require("rxjs/internal/operators");
var endpoint_health_1 = require("../capabilities/endpoint-health");
var Component = /** @class */ (function () {
    function Component(rawComponent, loxoneRequest, statesEvents) {
        this.loxoneRequest = loxoneRequest;
        this.id = rawComponent.id;
        this.name = rawComponent.name;
        this.nicknames = rawComponent.nicknames || [rawComponent.name];
        this.type = rawComponent.type;
        this.room = rawComponent.room;
        this.extendedOption = rawComponent.extendedOption;
        this.modes = rawComponent.modes;
        this.target = rawComponent.target;
        this.loxoneId = rawComponent.loxoneId || rawComponent.id;
        this.loxoneSub = rawComponent.loxoneSub;
        this.statesEvents = statesEvents;
    }
    Component.prototype.getStates = function () {
        var _this = this;
        var capabilities = this.getCapabilities();
        capabilities.push(endpoint_health_1.EndpointHealthHandler.INSTANCE);
        return (0, fromArray_1.fromArray)(capabilities).pipe((0, operators_1.mergeMap)(function (handler) {
            return handler.getState(_this);
        }), (0, operators_1.toArray)(), (0, operators_1.map)(function (result) {
            // We merge all statesEvents into one object
            return result.reduce(function (acc, cur) {
                return Object.assign({}, acc, cur);
            }, {});
        }));
    };
    Component.prototype.getSync = function () {
        var _this = this;
        var capabilities = this.getCapabilities()
            .map(function (handler) { return handler.getTrait(); })
            .filter(function (trait) { return trait !== null; });
        var attributes = this.getCapabilities()
            .map(function (handler) { return handler.getAttributes(_this); })
            .reduce(function (acc, cur) {
            return Object.assign({}, acc, cur);
        }, {});
        return {
            'id': this.id,
            'name': {
                'name': this.name,
                'defaultNames': [this.name],
                'nicknames': this.nicknames
            },
            'roomHint': this.room,
            'willReportState': true,
            'type': 'action.devices.types.' + this.type,
            'traits': capabilities,
            'attributes': attributes
        };
    };
    Component.prototype.getHealthCheck = function () {
        return (0, index_1.of)({
            'online': true
        });
    };
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=component.js.map