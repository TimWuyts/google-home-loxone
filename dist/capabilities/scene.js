"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneHandler = void 0;
var of_1 = require("rxjs/internal/observable/of");
var SceneHandler = /** @class */ (function () {
    function SceneHandler() {
    }
    SceneHandler.prototype.getCommands = function () {
        return ['action.devices.commands.ActivateScene'];
    };
    SceneHandler.prototype.getTrait = function () {
        return 'action.devices.traits.Scene';
    };
    SceneHandler.prototype.getAttributes = function (component) {
        return {
            'sceneReversible': false
        };
    };
    SceneHandler.prototype.getState = function (component) {
        return (0, of_1.of)(true);
    };
    SceneHandler.prototype.handleCommands = function (component, command, payload) {
        return component.activate();
    };
    SceneHandler.INSTANCE = new SceneHandler();
    return SceneHandler;
}());
exports.SceneHandler = SceneHandler;
//# sourceMappingURL=scene.js.map