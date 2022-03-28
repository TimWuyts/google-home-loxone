"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanSpeedHandler = void 0;
var operators_1 = require("rxjs/operators");
var FanSpeedHandler = /** @class */ (function () {
    function FanSpeedHandler() {
    }
    FanSpeedHandler.prototype.getCommands = function () {
        return ['action.devices.commands.SetFanSpeed'];
    };
    FanSpeedHandler.prototype.getTrait = function () {
        return 'action.devices.traits.FanSpeed';
    };
    FanSpeedHandler.prototype.getAttributes = function (component) {
        return {
            'availableFanSpeeds': {
                'speeds': [
                    {
                        'speed_name': 'S1',
                        'speed_values': [{
                                'speed_synonym': ['stand 1', 'laag', 'minimum', 'snelheid 1'],
                                'lang': 'nl'
                            }]
                    },
                    {
                        'speed_name': 'S2',
                        'speed_values': [{
                                'speed_synonym': ['stand 2', 'gemiddeld', 'normaal', 'snelheid 2'],
                                'lang': 'nl'
                            }]
                    },
                    {
                        'speed_name': 'S3',
                        'speed_values': [{
                                'speed_synonym': ['stand 3', 'hoog', 'maximum', 'snelheid 3'],
                                'lang': 'nl'
                            }]
                    }
                ],
                'ordered': true
            },
            'reversible': true
        };
    };
    FanSpeedHandler.prototype.getState = function (component) {
        return component.getSelectedOption().pipe((0, operators_1.map)(function (val) {
            return {
                currentFanSpeedSetting: val
            };
        }));
    };
    FanSpeedHandler.prototype.handleCommands = function (component, command, payload) {
        var option;
        switch (payload['fanSpeed']) {
            case 'S1':
                option = 0;
                break;
            case 'S2':
                option = 1;
                break;
            case 'S3':
                option = 2;
                break;
            default: option = 0;
        }
        if (option === 0) {
            return component.reset();
        }
        else {
            return component.selectOption(option);
        }
    };
    FanSpeedHandler.INSTANCE = new FanSpeedHandler();
    return FanSpeedHandler;
}());
exports.FanSpeedHandler = FanSpeedHandler;
//# sourceMappingURL=fan-speed.js.map