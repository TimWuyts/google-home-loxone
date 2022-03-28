"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notifier = void 0;
var GoogleHome = __importStar(require("node-googlehome"));
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var Notifier = /** @class */ (function () {
    function Notifier(config) {
        this.devices = [];
        this.config = config;
        this.devices = config.notifier.devices;
    }
    Notifier.prototype.handler = function (request) {
        var deviceName = request.query.device;
        var text = request.query.text;
        if (this.config.log) {
            console.log('Notifier request received', deviceName, text, request);
        }
        var device = this.devices.find(function (dev) { return dev.name === deviceName; });
        if (!device) {
            return (0, rxjs_1.throwError)('Device not found');
        }
        var service = new GoogleHome.Connecter(device.ip);
        service.config({ lang: this.config.notifier.lang });
        return (0, rxjs_1.from)(service.speak(text))
            .pipe((0, operators_1.catchError)(function (err) {
            console.error(err);
            return (0, rxjs_1.throwError)("".concat(err.message));
        }));
    };
    return Notifier;
}());
exports.Notifier = Notifier;
//# sourceMappingURL=notifier.js.map