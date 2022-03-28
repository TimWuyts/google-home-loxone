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
exports.CustomOnOff = void 0;
var index_1 = require("rxjs/index");
var operators_1 = require("rxjs/internal/operators");
var on_off_1 = require("../capabilities/on-off");
var error_1 = require("../error");
var component_1 = require("./component");
var CustomOnOff = /** @class */ (function (_super) {
    __extends(CustomOnOff, _super);
    function CustomOnOff(rawComponent, loxoneRequest, statesEvents) {
        var _this = _super.call(this, rawComponent, loxoneRequest, statesEvents) || this;
        _this.loxoneRequest.getControlInformation(_this.loxoneId).subscribe(function (toggle) {
            _this.loxoneRequest.watchComponent(toggle['states']['active']).subscribe(function (event) {
                _this.active = event === 1 ? true : false;
                _this.statesEvents.next(_this);
            });
        });
        _this.onAction = rawComponent.customData['on'];
        _this.offAction = rawComponent.customData['off'];
        return _this;
    }
    CustomOnOff.prototype.getCapabilities = function () {
        return [
            on_off_1.OnOffHandler.INSTANCE
        ];
    };
    CustomOnOff.prototype.turnOn = function () {
        var _this = this;
        return this.loxoneRequest.sendCmd(this.loxoneId, this.onAction).pipe((0, operators_1.map)(function (result) {
            if (result.code === '200') {
                _this.active = true;
                _this.statesEvents.next(_this);
                return true;
            }
            throw new Error(error_1.ErrorType.ENDPOINT_UNREACHABLE);
        }));
    };
    CustomOnOff.prototype.turnOff = function () {
        var _this = this;
        return this.loxoneRequest.sendCmd(this.loxoneId, this.offAction).pipe((0, operators_1.map)(function (result) {
            if (result.code === '200') {
                _this.active = false;
                _this.statesEvents.next(_this);
                return true;
            }
            throw new Error(error_1.ErrorType.ENDPOINT_UNREACHABLE);
        }));
    };
    CustomOnOff.prototype.getPowerState = function () {
        return (0, index_1.of)(this.active);
    };
    return CustomOnOff;
}(component_1.Component));
exports.CustomOnOff = CustomOnOff;
//# sourceMappingURL=custom-on-off.js.map