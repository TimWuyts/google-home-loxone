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
exports.LightComponent = void 0;
var index_1 = require("rxjs/index");
var operators_1 = require("rxjs/operators");
var brightness_1 = require("../capabilities/brightness");
var endpoint_health_1 = require("../capabilities/endpoint-health");
var on_off_1 = require("../capabilities/on-off");
var error_1 = require("../error");
var component_1 = require("./component");
var LightComponent = /** @class */ (function (_super) {
    __extends(LightComponent, _super);
    function LightComponent(rawComponent, loxoneRequest, statesEvents) {
        var _this = _super.call(this, rawComponent, loxoneRequest, statesEvents) || this;
        _this.loxoneRequest.getControlInformation(_this.loxoneId).subscribe(function (light) {
            Object.keys(light.states).forEach(function (prop) {
                // Subscribe on each status update of the current light
                _this.loxoneRequest.watchComponent(light.states[prop]).subscribe(function (event) {
                    switch (prop) {
                        case 'active':
                            _this.on = event === 1 ? true : false;
                            _this.statesEvents.next(_this);
                            break;
                        case 'position':
                            _this.brightness = event;
                            _this.statesEvents.next(_this);
                    }
                });
            });
        });
        return _this;
    }
    LightComponent.prototype.getCapabilities = function () {
        var capabilities = [
            on_off_1.OnOffHandler.INSTANCE,
            endpoint_health_1.EndpointHealthHandler.INSTANCE,
        ];
        if (this.extendedOption && this.extendedOption.brightness) {
            capabilities.push(brightness_1.BrightnessHandler.INSTANCE);
        }
        return capabilities;
    };
    LightComponent.prototype.turnOn = function () {
        var _this = this;
        return this.loxoneRequest.sendCmd(this.loxoneId, 'on').pipe((0, operators_1.map)(function (result) {
            if (result.code === '200') {
                _this.on = true;
                _this.statesEvents.next(_this);
                return true;
            }
            throw new Error(error_1.ErrorType.ENDPOINT_UNREACHABLE);
        }));
    };
    LightComponent.prototype.turnOff = function () {
        var _this = this;
        return this.loxoneRequest.sendCmd(this.loxoneId, 'off').pipe((0, operators_1.map)(function (result) {
            if (result.code === '200') {
                _this.on = false;
                _this.statesEvents.next(_this);
                return true;
            }
            throw new Error(error_1.ErrorType.ENDPOINT_UNREACHABLE);
        }));
    };
    LightComponent.prototype.setBrightness = function (val) {
        var _this = this;
        return this.loxoneRequest.sendCmd(this.loxoneId, val).pipe((0, operators_1.map)(function (result) {
            if (result.code === '200') {
                _this.brightness = val;
                _this.statesEvents.next(_this);
                return true;
            }
            throw new Error(error_1.ErrorType.ENDPOINT_UNREACHABLE);
        }));
    };
    LightComponent.prototype.getPowerState = function () {
        return (0, index_1.of)(this.on);
    };
    LightComponent.prototype.getBrightnessState = function () {
        return (0, index_1.of)(this.brightness);
    };
    return LightComponent;
}(component_1.Component));
exports.LightComponent = LightComponent;
//# sourceMappingURL=light.js.map