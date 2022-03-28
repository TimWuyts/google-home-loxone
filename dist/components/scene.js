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
exports.SceneComponent = void 0;
var operators_1 = require("rxjs/operators");
var endpoint_health_1 = require("../capabilities/endpoint-health");
var scene_1 = require("../capabilities/scene");
var error_1 = require("../error");
var component_1 = require("./component");
var SceneComponent = /** @class */ (function (_super) {
    __extends(SceneComponent, _super);
    function SceneComponent(rawComponent, loxoneRequest, statesEvents) {
        return _super.call(this, rawComponent, loxoneRequest, statesEvents) || this;
    }
    SceneComponent.prototype.getCapabilities = function () {
        var capabilities = [
            scene_1.SceneHandler.INSTANCE,
            endpoint_health_1.EndpointHealthHandler.INSTANCE,
        ];
        return capabilities;
    };
    SceneComponent.prototype.activate = function () {
        var parts = this.loxoneId.split('/');
        var uuid = parts[0];
        var scene = parts[1];
        return this.loxoneRequest.sendCmd(uuid, scene).pipe((0, operators_1.map)(function (result) {
            if (result.code === '200') {
                return true;
            }
            throw new Error(error_1.ErrorType.ENDPOINT_UNREACHABLE);
        }));
    };
    return SceneComponent;
}(component_1.Component));
exports.SceneComponent = SceneComponent;
//# sourceMappingURL=scene.js.map