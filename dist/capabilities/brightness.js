"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrightnessHandler = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var BrightnessHandler = /** @class */ (function () {
    function BrightnessHandler() {
    }
    BrightnessHandler.prototype.getCommands = function () {
        return ['action.devices.commands.BrightnessAbsolute'];
    };
    BrightnessHandler.prototype.getTrait = function () {
        return 'action.devices.traits.Brightness';
    };
    BrightnessHandler.prototype.getAttributes = function (component) {
        return {};
    };
    BrightnessHandler.prototype.getState = function (component) {
        return component.getBrightnessState().pipe((0, operators_1.map)(function (val) {
            return {
                brightness: val
            };
        }));
    };
    BrightnessHandler.prototype.handleCommands = function (component, command, payload) {
        if (payload['brightness']) {
            return component.setBrightness(+payload['brightness']);
        }
        else {
            console.error('Error during setting brightness', component, payload);
            return (0, rxjs_1.of)(false);
        }
    };
    BrightnessHandler.INSTANCE = new BrightnessHandler();
    return BrightnessHandler;
}());
exports.BrightnessHandler = BrightnessHandler;
//# sourceMappingURL=brightness.js.map