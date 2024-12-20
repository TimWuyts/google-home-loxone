import yargs from "yargs";
import { Server } from './server';

const argv = yargs.options({
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

new Server(argv);