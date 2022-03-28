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
exports.AlarmComponent = void 0;
var index_1 = require("rxjs/index");
var operators_1 = require("rxjs/internal/operators");
var arm_disarm_1 = require("../capabilities/arm-disarm");
var endpoint_health_1 = require("../capabilities/endpoint-health");
var error_1 = require("../error");
var component_1 = require("./component");
var AlarmComponent = /** @class */ (function (_super) {
    __extends(AlarmComponent, _super);
    function AlarmComponent(rawComponent, loxoneRequest, statesEvents) {
        var _this = _super.call(this, rawComponent, loxoneRequest, statesEvents) || this;
        _this.loxoneRequest.getControlInformation(_this.loxoneId).subscribe(function (alarm) {
            _this.loxoneRequest.watchComponent(alarm['states']['armed']).subscribe(function (event) {
                _this.armed = event === 1 ? true : false;
                _this.statesEvents.next(_this);
            });
        });
        return _this;
    }
    AlarmComponent.prototype.getCapabilities = function () {
        return [
            arm_disarm_1.ArmDisarmHandler.INSTANCE,
            endpoint_health_1.EndpointHealthHandler.INSTANCE
        ];
    };
    AlarmComponent.prototype.turnOn = function () {
        var _this = this;
        return this.loxoneRequest.sendCmd(this.loxoneId, 'delayedon').pipe((0, operators_1.map)(function (result) {
            if (result.code === '200') {
                _this.armed = true;
                _this.statesEvents.next(_this);
                return true;
            }
            throw new Error(error_1.ErrorType.ENDPOINT_UNREACHABLE);
        }));
    };
    AlarmComponent.prototype.turnOff = function () {
        var _this = this;
        return this.loxoneRequest.sendCmd(this.loxoneId, 'off').pipe((0, operators_1.map)(function (result) {
            if (result.code === '200') {
                _this.armed = false;
                _this.statesEvents.next(_this);
                return true;
            }
            throw new Error(error_1.ErrorType.ENDPOINT_UNREACHABLE);
        }));
    };
    AlarmComponent.prototype.armedState = function () {
        return (0, index_1.of)(this.armed);
    };
    return AlarmComponent;
}(component_1.Component));
exports.AlarmComponent = AlarmComponent;
//# sourceMappingURL=alarm.js.map