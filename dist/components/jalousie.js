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
exports.JalousieComponent = void 0;
var index_1 = require("rxjs/index");
var operators_1 = require("rxjs/internal/operators");
var endpoint_health_1 = require("../capabilities/endpoint-health");
var open_close_1 = require("../capabilities/open-close");
var error_1 = require("../error");
var component_1 = require("./component");
var JalousieComponent = /** @class */ (function (_super) {
    __extends(JalousieComponent, _super);
    function JalousieComponent(rawComponent, loxoneRequest, statesEvents) {
        var _this = _super.call(this, rawComponent, loxoneRequest, statesEvents) || this;
        _this.loxoneRequest.getControlInformation(_this.loxoneId).subscribe(function (jalousie) {
            _this.loxoneRequest.watchComponent(jalousie['states']['position']).subscribe(function (event) {
                _this.statePos = (1 - event) * 100;
                _this.statesEvents.next(_this);
            });
            _this.loxoneRequest.watchComponent(jalousie['states']['up']).subscribe(function (event) {
                _this.stateUp = event;
                _this.statesEvents.next(_this);
            });
            _this.loxoneRequest.watchComponent(jalousie['states']['down']).subscribe(function (event) {
                _this.stateDown = event;
                _this.statesEvents.next(_this);
            });
        });
        return _this;
    }
    JalousieComponent.prototype.getCapabilities = function () {
        return [
            open_close_1.OpenCloseHandler.INSTANCE,
            endpoint_health_1.EndpointHealthHandler.INSTANCE,
        ];
    };
    JalousieComponent.prototype.open = function () {
        var _this = this;
        return this.loxoneRequest.sendCmd(this.loxoneId, 'FullUp').pipe((0, operators_1.map)(function (result) {
            if (result.code === '200') {
                _this.stateUp = true;
                _this.stateDown = false;
                _this.statesEvents.next(_this);
                return true;
            }
            throw new Error(error_1.ErrorType.ENDPOINT_UNREACHABLE);
        }));
    };
    JalousieComponent.prototype.close = function () {
        var _this = this;
        return this.loxoneRequest.sendCmd(this.loxoneId, 'FullDown').pipe((0, operators_1.map)(function (result) {
            if (result.code === '200') {
                _this.stateUp = false;
                _this.stateDown = true;
                _this.statesEvents.next(_this);
                return true;
            }
            throw new Error(error_1.ErrorType.ENDPOINT_UNREACHABLE);
        }));
    };
    JalousieComponent.prototype.position = function (percentage) {
        var _this = this;
        return this.loxoneRequest.sendCmd(this.loxoneId, 'manualPosition/' + (100 - percentage)).pipe((0, operators_1.map)(function (result) {
            if (result.code === '200') {
                _this.statePos = percentage;
                _this.stateUp = false;
                _this.stateDown = false;
                _this.statesEvents.next(_this);
                return true;
            }
            throw new Error(error_1.ErrorType.ENDPOINT_UNREACHABLE);
        }));
    };
    JalousieComponent.prototype.getState = function () {
        return (0, index_1.of)(this.statePos);
    };
    return JalousieComponent;
}(component_1.Component));
exports.JalousieComponent = JalousieComponent;
//# sourceMappingURL=jalousie.js.map