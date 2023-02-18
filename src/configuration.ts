import fs from "fs";
import path from "path";
import { IConfig } from "./interfaces/config/root";
import { IConfigDevice } from "./interfaces/config/device";
import { IConfigServer } from "./interfaces/config/server";
import Logger from "./logger";

export default class Configuration {
  static instance: Configuration;

  path: string;
  config: IConfig;

  reloadCallback: () => Promise<void>;

  constructor(path: string, reloadCallback: () => Promise<void>) {
    this.path = path;
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

    if (fs.existsSync(this.path)) {
      this.readFile();

      const _this = this;
      fs.watch(this.path, () => _this.handleReload());
    } else {
      Logger.Error(
        "Unable to find the configuration file 'config.js', exiting"
      );
      process.exit(1);
    }
  }

  private readFile(): void {
    try {
      let rawdata = fs.readFileSync("config.json");
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
