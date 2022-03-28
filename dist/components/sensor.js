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
exports.SensorComponent = void 0;
var index_1 = require("rxjs/index");
var temperature_control_1 = require("../capabilities/temperature-control");
var component_1 = require("./component");
var SensorComponent = /** @class */ (function (_super) {
    __extends(SensorComponent, _super);
    function SensorComponent(rawComponent, loxoneRequest, statesEvents) {
        var _this = _super.call(this, rawComponent, loxoneRequest, statesEvents) || this;
        _this.temperatureState = new temperature_control_1.TemperatureState();
        _this.loxoneRequest.getControlInformation(_this.loxoneId).subscribe(function (control) {
            _this.loxoneRequest.watchComponent(_this.loxoneId).subscribe(function (event) {
                _this.temperatureState.temperatureAmbientCelsius = parseInt(event, 10);
            });
            _this.temperatureState.temperatureSetpointCelsius = rawComponent.target || 20;
        });
        return _this;
    }
    SensorComponent.prototype.getCapabilities = function () {
        return [
            temperature_control_1.TemperatureControlHandler.INSTANCE
        ];
    };
    SensorComponent.prototype.getTemperature = function () {
        return (0, index_1.of)(this.temperatureState);
    };
    return SensorComponent;
}(component_1.Component));
exports.SensorComponent = SensorComponent;
//# sourceMappingURL=sensor.js.map