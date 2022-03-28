"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArmDisarmHandler = void 0;
var operators_1 = require("rxjs/operators");
var ArmDisarmHandler = /** @class */ (function () {
    function ArmDisarmHandler() {
    }
    ArmDisarmHandler.prototype.getCommands = function () {
        return ['action.devices.commands.ArmDisarm'];
    };
    ArmDisarmHandler.prototype.getTrait = function () {
        return 'action.devices.traits.ArmDisarm';
    };
    ArmDisarmHandler.prototype.getAttributes = function (component) {
        return {};
    };
    ArmDisarmHandler.prototype.getState = function (component) {
        return component.armedState().pipe((0, operators_1.map)(function (result) {
            return {
                isArmed: result
            };
        }));
    };
    ArmDisarmHandler.prototype.handleCommands = function (component, command, payload) {
        if (payload['arm']) {
            return component.turnOn();
        }
        else {
            return component.turnOff();
        }
    };
    ArmDisarmHandler.INSTANCE = new ArmDisarmHandler();
    return ArmDisarmHandler;
}());
exports.ArmDisarmHandler = ArmDisarmHandler;
//# sourceMappingURL=arm-disarm.js.map