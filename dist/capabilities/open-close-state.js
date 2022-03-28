"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenCloseStateHandler = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var OpenCloseStateHandler = /** @class */ (function () {
    function OpenCloseStateHandler() {
    }
    OpenCloseStateHandler.prototype.getCommands = function () {
        return [];
    };
    OpenCloseStateHandler.prototype.getTrait = function () {
        return 'action.devices.traits.OpenClose';
    };
    OpenCloseStateHandler.prototype.getAttributes = function (component) {
        return {
            'discreteOnlyOpenClose': true,
            'queryOnlyOpenClose': true
        };
    };
    OpenCloseStateHandler.prototype.getState = function (component) {
        return component.getState().pipe((0, operators_1.map)(function (result) {
            return {
                openPercent: result
            };
        }));
    };
    OpenCloseStateHandler.prototype.handleCommands = function (component, command, payload) {
        return (0, rxjs_1.of)(false);
    };
    OpenCloseStateHandler.INSTANCE = new OpenCloseStateHandler();
    return OpenCloseStateHandler;
}());
exports.OpenCloseStateHandler = OpenCloseStateHandler;
//# sourceMappingURL=open-close-state.js.map