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
exports.FanComponent = void 0;
var index_1 = require("rxjs/index");
var operators_1 = require("rxjs/internal/operators");
var endpoint_health_1 = require("../capabilities/endpoint-health");
var fan_speed_1 = require("../capabilities/fan-speed");
var component_1 = require("./component");
var FanComponent = /** @class */ (function (_super) {
    __extends(FanComponent, _super);
    function FanComponent(rawComponent, loxoneRequest, statesEvents) {
        var _this = _super.call(this, rawComponent, loxoneRequest, statesEvents) || this;
        _this.loxoneRequest.getControlInformation(_this.loxoneId).subscribe(function (fan) {
            _this.loxoneRequest.watchComponent(fan['states']['activeOutput']).subscribe(function (event) {
                _this.output = event;
            });
        });
        return _this;
    }
    FanComponent.prototype.getCapabilities = function () {
        return [
            fan_speed_1.FanSpeedHandler.INSTANCE,
            endpoint_health_1.EndpointHealthHandler.INSTANCE
        ];
    };
    FanComponent.prototype.selectOption = function (option) {
        var _this = this;
        return this.loxoneRequest.sendCmd(this.loxoneId, option.toString()).pipe((0, operators_1.map)(function (result) {
            if (result.code === '200') {
                _this.output = option;
                return true;
            }
        }));
    };
    FanComponent.prototype.reset = function () {
        var _this = this;
        return this.loxoneRequest.sendCmd(this.loxoneId, 'reset').pipe((0, operators_1.map)(function (result) {
            if (result.code === '200') {
                _this.output = 0;
                return true;
            }
        }));
    };
    FanComponent.prototype.getSelectedOption = function () {
        return (0, index_1.of)(this.output);
    };
    FanComponent.prototype.getPowerState = function () {
        return (0, index_1.of)(this.output > 0);
    };
    return FanComponent;
}(component_1.Component));
exports.FanComponent = FanComponent;
//# sourceMappingURL=fan.js.map