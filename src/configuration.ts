import fs from "fs";
import { IConfig, IConfigDevice, IConfigServer } from "./interfaces/config";
import Logger from "./logger";

export default class Configuration {
  static instance: Configuration;
  private static configFile = "config.json";
  private static defaultConfig: IConfig = {
    server: {
      port: 3000,
      deviceReconnectWait: 5000,
      sendCommandDelay: 5000,
    },
    webhooks: [],
    devices: [],
  };

  config: IConfig;

  reloadCallback: () => Promise<void>;

  constructor(reloadCallback: () => Promise<void>) {
    this.reloadCallback = reloadCallback;
  }

  server(): IConfigServer {
    return this.config.server;
  }

  devices(): IConfigDevice[] {
    return this.config.devices;
  }

  webhooks(): string[] {
    return this.config.webhooks;
  }

  async initialize(): Promise<void> {
    Configuration.instance = this;

    try {
      if (!fs.existsSync(Configuration.configFile)) {
        Logger.Warning(
          `Unable to find the configuration file '${Configuration.configFile}', creating with default configuration.`
        );
        fs.writeFileSync(
          Configuration.configFile,
          JSON.stringify(Configuration.defaultConfig, null, 2)
        );
      }
    } catch (ex) {
      Logger.Error(
        `Error checking or creating configuration file, exiting`,
        ex
      );
      process.exit(1);
    }

    this.readFile();
    fs.watch(Configuration.configFile, () => this.handleReload());
  }

  private readFile(): void {
    try {
      let rawdata = fs.readFileSync(Configuration.configFile);
      this.config = JSON.parse(rawdata.toString());
    } catch (ex) {
      Logger.Error("Failed to read configuration file", ex);
    }
  }

  private handleReload() {
    Logger.Info(`Configuration file is changed, reloading`);
    this.readFile();
    this.reloadCallback();
  }
}
