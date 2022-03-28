"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handlers = void 0;
var arm_disarm_1 = require("./arm-disarm");
var brightness_1 = require("./brightness");
var endpoint_health_1 = require("./endpoint-health");
var fan_speed_1 = require("./fan-speed");
var on_off_1 = require("./on-off");
var open_close_1 = require("./open-close");
var open_close_state_1 = require("./open-close-state");
var scene_1 = require("./scene");
var temperature_control_1 = require("./temperature-control");
var temperature_setting_1 = require("./temperature-setting");
var Handlers = /** @class */ (function () {
    function Handlers() {
        var _this = this;
        this.internalDict = {};
        this.handlers = [
            fan_speed_1.FanSpeedHandler.INSTANCE,
            on_off_1.OnOffHandler.INSTANCE,
            open_close_1.OpenCloseHandler.INSTANCE,
            open_close_state_1.OpenCloseStateHandler.INSTANCE,
            arm_disarm_1.ArmDisarmHandler.INSTANCE,
            brightness_1.BrightnessHandler.INSTANCE,
            scene_1.SceneHandler.INSTANCE,
            endpoint_health_1.EndpointHealthHandler.INSTANCE,
            temperature_control_1.TemperatureControlHandler.INSTANCE,
            temperature_setting_1.TemperatureSettingHandler.INSTANCE
        ];
        this.handlers.forEach(function (handler) {
            handler.getCommands().forEach(function (command) {
                _this.internalDict[command] = handler;
            });
        });
    }
    Handlers.prototype.getHandler = function (command) {
        return this.internalDict[command];
    };
    return Handlers;
}());
exports.Handlers = Handlers;
//# sourceMappingURL=capability-handler.js.map