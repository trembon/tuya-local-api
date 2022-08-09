import { Config, ConfigDevice, ConfigServer } from './config.interface';
const config: Config = require("../config.json");

export default class Configuration {
    static Server(): ConfigServer {
        return config.server;
    }

    static Devices(): ConfigDevice[] {
        return config.devices;
    }
}