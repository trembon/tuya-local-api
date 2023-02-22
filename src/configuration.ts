import fs from "fs";
import { IConfig } from "./interfaces/config/root";
import { IConfigDevice } from "./interfaces/config/device";
import { IConfigServer } from "./interfaces/config/server";
import Logger from "./logger";

export default class Configuration {
  static instance: Configuration;
  private static configFile = "config.json";

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

    if (fs.existsSync(Configuration.configFile)) {
      this.readFile();
      fs.watch(Configuration.configFile, () => this.handleReload());
    } else {
      Logger.Error(
        `Unable to find the configuration file '${Configuration.configFile}', exiting`
      );
      process.exit(1);
    }
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
