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
exports.WindowComponent = void 0;
var index_1 = require("rxjs/index");
var operators_1 = require("rxjs/internal/operators");
var endpoint_health_1 = require("../capabilities/endpoint-health");
var open_close_1 = require("../capabilities/open-close");
var open_close_state_1 = require("../capabilities/open-close-state");
var error_1 = require("../error");
var component_1 = require("./component");
var WindowComponent = /** @class */ (function (_super) {
    __extends(WindowComponent, _super);
    function WindowComponent(rawComponent, loxoneRequest, statesEvents) {
        var _this = _super.call(this, rawComponent, loxoneRequest, statesEvents) || this;
        _this.loxoneRequest.getControlInformation(_this.loxoneId).subscribe(function (window) {
            switch (window['type']) {
                case 'InfoOnlyDigital':
                    _this.loxoneRequest.watchComponent(window['states']['active']).subscribe(function (event) {
                        _this.statePos = (event === 1) ? 100 : 0;
                        _this.statesEvents.next(_this);
                    });
                    break;
                case 'Window':
                    _this.loxoneRequest.watchComponent(window['states']['position']).subscribe(function (event) {
                        _this.statePos = event * 100;
                        _this.statesEvents.next(_this);
                    });
                    break;
            }
        });
        return _this;
    }
    WindowComponent.prototype.getCapabilities = function () {
        var capabilities = [
            endpoint_health_1.EndpointHealthHandler.INSTANCE,
        ];
        if (this.extendedOption && this.extendedOption.motorised) {
            capabilities.push(open_close_1.OpenCloseHandler.INSTANCE);
        }
        else {
            capabilities.push(open_close_state_1.OpenCloseStateHandler.INSTANCE);
        }
        return capabilities;
    };
    WindowComponent.prototype.open = function () {
        var _this = this;
        return this.loxoneRequest.sendCmd(this.loxoneId, 'fullopen').pipe((0, operators_1.map)(function (result) {
            if (result.code === '200') {
                _this.stateOpened = true;
                _this.stateClosed = false;
                _this.statesEvents.next(_this);
                return true;
            }
            throw new Error(error_1.ErrorType.ENDPOINT_UNREACHABLE);
        }));
    };
    WindowComponent.prototype.close = function () {
        var _this = this;
        return this.loxoneRequest.sendCmd(this.loxoneId, 'fullclose').pipe((0, operators_1.map)(function (result) {
            if (result.code === '200') {
                _this.stateOpened = false;
                _this.stateClosed = true;
                _this.statesEvents.next(_this);
                return true;
            }
            throw new Error(error_1.ErrorType.ENDPOINT_UNREACHABLE);
        }));
    };
    WindowComponent.prototype.position = function (percentage) {
        var _this = this;
        return this.loxoneRequest.sendCmd(this.loxoneId, 'moveToPosition/' + percentage).pipe((0, operators_1.map)(function (result) {
            if (result.code === '200') {
                _this.statePos = percentage;
                _this.stateOpened = false;
                _this.stateClosed = false;
                _this.statesEvents.next(_this);
                return true;
            }
            throw new Error(error_1.ErrorType.ENDPOINT_UNREACHABLE);
        }));
    };
    WindowComponent.prototype.getState = function () {
        return (0, index_1.of)((this.statePos));
    };
    return WindowComponent;
}(component_1.Component));
exports.WindowComponent = WindowComponent;
//# sourceMappingURL=window.js.map