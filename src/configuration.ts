import { Config, ConfigDevice, ConfigServer } from './config.interface.js';
import config from '../config.js';

export default class Configuration {
    static Server(): ConfigServer {
        return config.server;
    }

    static Devices(): ConfigDevice[] {
        return config.devices;
    }

    static Webbhooks(): string[] {
        return config.webhooks;
    }
}