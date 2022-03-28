"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TogglesHandler = exports.Toggle = exports.ToggleSynonym = void 0;
var ToggleSynonym = /** @class */ (function () {
    function ToggleSynonym() {
    }
    return ToggleSynonym;
}());
exports.ToggleSynonym = ToggleSynonym;
var Toggle = /** @class */ (function () {
    function Toggle() {
    }
    return Toggle;
}());
exports.Toggle = Toggle;
var TogglesHandler = /** @class */ (function () {
    function TogglesHandler() {
    }
    TogglesHandler.prototype.getCommands = function () {
        return [
            'action.devices.commands.SetToggles',
        ];
    };
    TogglesHandler.prototype.getState = function (component) {
        return component.getStateToggles();
    };
    TogglesHandler.prototype.getTrait = function () {
        return 'action.devices.traits.Toggles';
    };
    TogglesHandler.prototype.getAttributes = function (component) {
        return {
            availableToggles: component.getToggles()
        };
    };
    TogglesHandler.prototype.handleCommands = function (component, command, params) {
        return component.handleToggle(params['updateToggleSettings']);
    };
    TogglesHandler.INSTANCE = new TogglesHandler();
    return TogglesHandler;
}());
exports.TogglesHandler = TogglesHandler;
//# sourceMappingURL=toggles.js.map