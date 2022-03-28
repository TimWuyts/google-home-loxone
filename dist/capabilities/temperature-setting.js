"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemperatureSettingHandler = exports.TemperatureState = void 0;
var of_1 = require("rxjs/internal/observable/of");
var TemperatureState = /** @class */ (function () {
    function TemperatureState() {
    }
    return TemperatureState;
}());
exports.TemperatureState = TemperatureState;
var TemperatureSettingHandler = /** @class */ (function () {
    function TemperatureSettingHandler() {
    }
    TemperatureSettingHandler.prototype.getCommands = function () {
        return [
            'action.devices.commands.ThermostatTemperatureSetpoint'
        ];
    };
    TemperatureSettingHandler.prototype.getState = function (component) {
        return component.getTemperature();
    };
    TemperatureSettingHandler.prototype.getTrait = function () {
        return 'action.devices.traits.TemperatureSetting';
    };
    TemperatureSettingHandler.prototype.getAttributes = function (component) {
        return {
            'availableThermostatModes': component.getThermostatModes(),
            'thermostatTemperatureUnit': 'C'
        };
    };
    TemperatureSettingHandler.prototype.handleCommands = function (component, command, payload) {
        if (payload['thermostatTemperatureSetpoint']) {
            return component.setTemperature(+payload['thermostatTemperatureSetpoint']);
        }
        else {
            console.error('Error during setting temperature', component, payload);
            return (0, of_1.of)(false);
        }
    };
    TemperatureSettingHandler.INSTANCE = new TemperatureSettingHandler();
    return TemperatureSettingHandler;
}());
exports.TemperatureSettingHandler = TemperatureSettingHandler;
//# sourceMappingURL=temperature-setting.js.map