"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemperatureControlHandler = exports.TemperatureState = void 0;
var of_1 = require("rxjs/internal/observable/of");
var TemperatureState = /** @class */ (function () {
    function TemperatureState() {
    }
    return TemperatureState;
}());
exports.TemperatureState = TemperatureState;
var TemperatureControlHandler = /** @class */ (function () {
    function TemperatureControlHandler() {
    }
    TemperatureControlHandler.prototype.getCommands = function () {
        return [];
    };
    TemperatureControlHandler.prototype.getState = function (component) {
        return component.getTemperature();
    };
    TemperatureControlHandler.prototype.getTrait = function () {
        return 'action.devices.traits.TemperatureControl';
    };
    TemperatureControlHandler.prototype.getAttributes = function (component) {
        return {
            'temperatureUnitForUX': 'C',
            'queryOnlyTemperatureControl': true
        };
    };
    TemperatureControlHandler.prototype.handleCommands = function (component, command, payload) {
        return (0, of_1.of)(false);
    };
    TemperatureControlHandler.INSTANCE = new TemperatureControlHandler();
    return TemperatureControlHandler;
}());
exports.TemperatureControlHandler = TemperatureControlHandler;
//# sourceMappingURL=temperature-control.js.map