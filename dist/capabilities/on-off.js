"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnOffHandler = void 0;
var operators_1 = require("rxjs/operators");
var OnOffHandler = /** @class */ (function () {
    function OnOffHandler() {
    }
    OnOffHandler.prototype.getCommands = function () {
        return ['action.devices.commands.OnOff'];
    };
    OnOffHandler.prototype.getTrait = function () {
        return 'action.devices.traits.OnOff';
    };
    OnOffHandler.prototype.getAttributes = function (component) {
        return {};
    };
    OnOffHandler.prototype.getState = function (component) {
        return component.getPowerState().pipe((0, operators_1.map)(function (result) {
            return {
                on: result
            };
        }));
    };
    OnOffHandler.prototype.handleCommands = function (component, command, payload) {
        if (payload['on']) {
            return component.turnOn();
        }
        else {
            return component.turnOff();
        }
    };
    OnOffHandler.INSTANCE = new OnOffHandler();
    return OnOffHandler;
}());
exports.OnOffHandler = OnOffHandler;
//# sourceMappingURL=on-off.js.map