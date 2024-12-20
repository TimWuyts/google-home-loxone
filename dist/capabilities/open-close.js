"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenCloseHandler = void 0;
var operators_1 = require("rxjs/operators");
var OpenCloseHandler = /** @class */ (function () {
    function OpenCloseHandler() {
    }
    OpenCloseHandler.prototype.getCommands = function () {
        return ['action.devices.commands.OpenClose'];
    };
    OpenCloseHandler.prototype.getTrait = function () {
        return 'action.devices.traits.OpenClose';
    };
    OpenCloseHandler.prototype.getAttributes = function (component) {
        return {};
    };
    OpenCloseHandler.prototype.getState = function (component) {
        return component.getState().pipe((0, operators_1.map)(function (result) {
            return {
                openPercent: result
            };
        }));
    };
    OpenCloseHandler.prototype.handleCommands = function (component, command, payload) {
        switch (payload['openPercent']) {
            case 100: return component.open();
            case 0: return component.close();
            default: return component.position(payload['openPercent']);
        }
    };
    OpenCloseHandler.INSTANCE = new OpenCloseHandler();
    return OpenCloseHandler;
}());
exports.OpenCloseHandler = OpenCloseHandler;
//# sourceMappingURL=open-close.js.map