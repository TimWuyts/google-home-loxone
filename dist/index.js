"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = __importDefault(require("yargs"));
var server_1 = require("./server");
var argv = yargs_1.default.options({
    verbose: {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging'
    },
    port: {
        alias: 'p',
        type: 'number',
        default: 3001,
        description: 'Http server port'
    },
    jwt: {
        alias: 'j',
        type: 'string',
        default: '../jwt.json',
        description: 'JWT file path'
    },
    config: {
        alias: 'c',
        type: 'string',
        default: '../config.json',
        description: 'Config file path'
    }
}).argv;
new server_1.Server(argv);
//# sourceMappingURL=index.js.map