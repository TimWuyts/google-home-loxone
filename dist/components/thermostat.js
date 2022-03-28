"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThermostatComponent = void 0;
var index_1 = require("rxjs/index");
var operators_1 = require("rxjs/operators");
var temperature_setting_1 = require("../capabilities/temperature-setting");
var error_1 = require("../error");
var component_1 = require("./component");
var ThermostatComponent = /** @class */ (function (_super) {
    __extends(ThermostatComponent, _super);
    function ThermostatComponent(rawComponent, loxoneRequest, statesEvents) {
        var _this = _super.call(this, rawComponent, loxoneRequest, statesEvents) || this;
        _this.temperatureState = new temperature_setting_1.TemperatureState();
        _this.loxoneRequest.getControlInformation(_this.loxoneId).subscribe(function (control) {
            var modes = 'off'; // default mode when not specified in config
            if (rawComponent.modes) {
                modes = rawComponent.modes;
            }
            _this.temperatureState.thermostatMode = modes;
            _this.loxoneRequest.watchComponent(control['states']['tempActual']).subscribe(function (event) {
                _this.temperatureState.thermostatTemperatureAmbient = parseInt(event, 10);
            });
            _this.loxoneRequest.watchComponent(control['states']['tempTarget']).subscribe(function (event) {
                _this.temperatureState.thermostatTemperatureSetpoint = parseInt(event, 10);
            });
        });
        return _this;
    }
    ThermostatComponent.prototype.getCapabilities = function () {
        return [
            temperature_setting_1.TemperatureSettingHandler.INSTANCE
        ];
    };
    ThermostatComponent.prototype.getThermostatModes = function () {
        return this.temperatureState.thermostatMode;
    };
    ThermostatComponent.prototype.getTemperature = function () {
        return (0, index_1.of)(this.temperatureState);
    };
    ThermostatComponent.prototype.setTemperature = function (target) {
        var _this = this;
        return this.loxoneRequest.sendCmd(this.loxoneId, 'setManualTemperature/' + target).pipe((0, operators_1.map)(function (result) {
            if (result.code === '200') {
                _this.temperatureState.thermostatTemperatureSetpoint = target;
                _this.statesEvents.next(_this);
                return true;
            }
            throw new Error(error_1.ErrorType.ENDPOINT_UNREACHABLE);
        }));
    };
    return ThermostatComponent;
}(component_1.Component));
exports.ThermostatComponent = ThermostatComponent;
//# sourceMappingURL=thermostat.js.map