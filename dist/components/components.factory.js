"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentsFactory = void 0;
var alarm_1 = require("./alarm");
var custom_on_off_1 = require("./custom-on-off");
var door_1 = require("./door");
var fan_1 = require("./fan");
var jalousie_1 = require("./jalousie");
var light_1 = require("./light");
var scene_1 = require("./scene");
var sensor_1 = require("./sensor");
var thermostat_1 = require("./thermostat");
var window_1 = require("./window");
var ComponentsFactory = /** @class */ (function () {
    function ComponentsFactory(config, loxoneRequest, statesEvents) {
        var _this = this;
        this.components = {};
        config.components
            .forEach(function (rawComponent) {
            var component;
            switch (rawComponent.loxoneType) {
                case 'Light':
                    component = new light_1.LightComponent(rawComponent, loxoneRequest, statesEvents);
                    break;
                case 'Thermostat':
                    component = new thermostat_1.ThermostatComponent(rawComponent, loxoneRequest, statesEvents);
                    break;
                case 'Sensor':
                    component = new sensor_1.SensorComponent(rawComponent, loxoneRequest, statesEvents);
                    break;
                case 'Jalousie':
                case 'CentralJalousie':
                    component = new jalousie_1.JalousieComponent(rawComponent, loxoneRequest, statesEvents);
                    break;
                case 'Fan':
                    component = new fan_1.FanComponent(rawComponent, loxoneRequest, statesEvents);
                    break;
                case 'Alarm':
                    component = new alarm_1.AlarmComponent(rawComponent, loxoneRequest, statesEvents);
                    break;
                case 'Door':
                    component = new door_1.DoorComponent(rawComponent, loxoneRequest, statesEvents);
                    break;
                case 'Window':
                case 'CentralWindow':
                    component = new window_1.WindowComponent(rawComponent, loxoneRequest, statesEvents);
                    break;
                case 'Custom-OnOff':
                    component = new custom_on_off_1.CustomOnOff(rawComponent, loxoneRequest, statesEvents);
                    break;
                case 'Scene':
                    component = new scene_1.SceneComponent(rawComponent, loxoneRequest, statesEvents);
                    break;
            }
            if (component != null) {
                _this.components[component.id] = component;
            }
        });
    }
    ComponentsFactory.prototype.getComponent = function () {
        return this.components;
    };
    return ComponentsFactory;
}());
exports.ComponentsFactory = ComponentsFactory;
//# sourceMappingURL=components.factory.js.map