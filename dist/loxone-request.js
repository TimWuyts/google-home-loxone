"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoxoneRequest = void 0;
var index_1 = require("rxjs/index");
var operators_1 = require("rxjs/operators");
var LoxoneWebSocket = require('node-lox-ws-api');
var LoxoneRequest = /** @class */ (function () {
    function LoxoneRequest(config) {
        var _this = this;
        this.commandChain = [];
        this.config = config;
        this.socket = new LoxoneWebSocket(config.loxone.url, config.loxone.user, config.loxone.password, true);
        this.connect();
        this.structureSubject = new index_1.Subject();
        this.socket.on('get_structure_file', function (data) {
            _this.structureFile = data;
            _this.structureSubject.next(data);
            _this.structureSubject.complete();
        });
    }
    LoxoneRequest.prototype.connect = function () {
        var _this = this;
        this.socket.connect();
        this.socket.on('connect_failed', function () {
            console.error('Connection to Loxone failed');
            setTimeout(function () { return _this.socket.connect(); }, 10000);
        });
        this.socket.on('message_text', function (message) {
            for (var index = _this.commandChain.length - 1; index >= 0; index--) {
                var item = _this.commandChain[index];
                if (item.control === message.control) {
                    item.callback(message);
                    _this.commandChain.splice(index, 1);
                    break;
                }
            }
        });
    };
    LoxoneRequest.prototype.watchComponent = function (uuid) {
        var events = new index_1.Subject();
        this.socket.on("update_event_value_".concat(uuid), function (state) {
            events.next(state);
        });
        return events;
    };
    LoxoneRequest.prototype.sendCmd = function (uuidAction, state) {
        // Do not send command in test mode
        if (this.config.testMode) {
            return (0, index_1.of)({
                code: '200',
            });
        }
        var events = new index_1.Subject();
        var commandEdited = "jdev/sps/io/".concat(uuidAction, "/").concat(state);
        this.commandChain.push({
            'control': "dev/sps/io/".concat(uuidAction, "/").concat(state),
            'callback': function (result) {
                events.next(result);
                events.complete();
            }
        });
        if (this.config.log) {
            console.log("WS: Send Cmd: ".concat(commandEdited));
        }
        this.socket.send_command(commandEdited, false);
        return events;
    };
    LoxoneRequest.prototype.getControlInformation = function (uuid) {
        var parts = uuid.split('/');
        var subcontrol = parts[1];
        uuid = parts[0];
        return this.getStructureFile().pipe((0, operators_1.map)(function (structure) {
            if (structure['controls'][uuid] === undefined) {
                console.warn("The component ".concat(uuid, " does not exist in Loxone"));
                return;
            }
            if (subcontrol) {
                var subUuid = "".concat(uuid, "/").concat(subcontrol);
                if (structure['controls'][uuid]['subControls'][subUuid] === undefined) {
                    console.warn("The component ".concat(uuid, " does not have a subcontrol ").concat(subcontrol, " in Loxone"));
                    return;
                }
                else {
                    return structure['controls'][uuid]['subControls'][subUuid];
                }
            }
            else {
                return structure['controls'][uuid];
            }
        }));
    };
    LoxoneRequest.prototype.getStructureFile = function () {
        if (this.structureFile !== undefined) {
            return (0, index_1.of)(this.structureFile);
        }
        return this.structureSubject;
    };
    return LoxoneRequest;
}());
exports.LoxoneRequest = LoxoneRequest;
//# sourceMappingURL=loxone-request.js.map