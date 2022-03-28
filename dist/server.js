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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
var bodyParser = __importStar(require("body-parser"));
var express_1 = __importDefault(require("express"));
var fs_1 = require("fs");
var rxjs_1 = require("rxjs");
var Subject_1 = require("rxjs/internal/Subject");
var auth_1 = require("./auth");
var components_factory_1 = require("./components/components.factory");
var google_smart_home_1 = require("./google-smart-home");
var loxone_request_1 = require("./loxone-request");
var notifier_1 = require("./notifier/notifier");
var path = require('path');
var Server = /** @class */ (function () {
    function Server(argv, callback) {
        this.jwtPath = path.resolve(__dirname, argv.jwt);
        this.jwtConfig = JSON.parse((0, fs_1.readFileSync)(this.jwtPath, 'utf-8'));
        this.config = JSON.parse((0, fs_1.readFileSync)(path.resolve(__dirname, argv.config), 'utf-8'));
        this.config.serverPort = argv.port;
        if (argv.verbose) {
            this.config.log = true;
        }
        this.app = (0, express_1.default)();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(function (err, req, res, next) {
            err.status = 404;
            next(err);
        });
        var statesEvents = new Subject_1.Subject();
        var loxoneRequest = new loxone_request_1.LoxoneRequest(this.config);
        var components = new components_factory_1.ComponentsFactory(this.config, loxoneRequest, statesEvents);
        this.smartHome = new google_smart_home_1.GoogleSmartHome(this.config, components, new auth_1.Auth0(this.config), statesEvents, this.jwtConfig, this.jwtPath);
        this.notifier = new notifier_1.Notifier(this.config);
        this.routes();
        this.init(argv.port).subscribe(function () {
            console.log('Server initialized');
            if (callback) {
                callback();
            }
        });
    }
    Server.prototype.init = function (port) {
        var _this = this;
        return new rxjs_1.Observable(function (subscriber) {
            _this.server = _this.app.listen(port, function () {
                console.log('Smart Home Cloud and App listening at %s:%s', "http://localhost", port);
                _this.smartHome.init();
                subscriber.next();
                subscriber.complete();
            });
        });
    };
    Server.prototype.routes = function () {
        var _this = this;
        var router = express_1.default.Router();
        router.post('/smarthome', function (request, response) {
            var data = request.body;
            if (_this.config.log) {
                console.log('Smarthome request received', JSON.stringify(data, null, 4));
            }
            _this.smartHome.handler(data, request).subscribe(function (result) {
                if (_this.config.log) {
                    console.log('Response sent to Google', JSON.stringify(result));
                }
                response.status(200).set({
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                }).json(result);
            });
        });
        router.get('/speech', function (request, response) {
            _this.notifier.handler(request).subscribe(function (result) {
                response.status(200).json(result);
            }, function (error) {
                response.status(500).json({ error: error });
            });
        });
        this.app.use(router);
    };
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=server.js.map