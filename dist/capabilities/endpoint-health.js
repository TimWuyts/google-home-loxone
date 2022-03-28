"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointHealthHandler = void 0;
var of_1 = require("rxjs/internal/observable/of");
var EndpointHealthHandler = /** @class */ (function () {
    function EndpointHealthHandler() {
    }
    EndpointHealthHandler.prototype.getTrait = function () {
        return null;
    };
    EndpointHealthHandler.prototype.getAttributes = function (component) {
        return {};
    };
    EndpointHealthHandler.prototype.getState = function (component) {
        return component.getHealthCheck();
    };
    EndpointHealthHandler.prototype.handleCommands = function (component, command, payload) {
        return (0, of_1.of)(true);
    };
    EndpointHealthHandler.prototype.getCommands = function () {
        return [];
    };
    EndpointHealthHandler.INSTANCE = new EndpointHealthHandler();
    return EndpointHealthHandler;
}());
exports.EndpointHealthHandler = EndpointHealthHandler;
//# sourceMappingURL=endpoint-health.js.map