import TuyAPI from "tuyapi";
import Configuration from "./configuration.js";
import { IConfigDevice } from "./interfaces/config";
import {
  ITuyaData,
  ITuyaMultipleProperties,
  ITuyaSingleProperty,
} from "./interfaces/tuya";
import Logger from "./logger.js";
import PublicDevice from "./public-device.model.js";
import sendWebhook from "./send-webhook.js";

export default class ActiveDevice {
  tuya: TuyAPI;
  device: IConfigDevice;

  constructor(device: IConfigDevice) {
    this.device = device;
    this.tuya = new TuyAPI({
      id: device.id,
      key: device.key,
      issueGetOnConnect: false,
      apiVersion: device.apiVersion,
    });

    this.tuya.on("connected", () => this.onConnected());
    this.tuya.on("disconnected", () => this.onDisconnected());
    this.tuya.on("error", (error) => this.onError(error));
    this.tuya.on("data", (data: ITuyaData) => this.onData(data));
  }

  async connect(): Promise<void> {
    if (this.device.disabled) {
      return;
    }

    try {
      await this.tuya.find();
      await this.tuya.connect();
    } catch (ex: unknown) {
      Logger.Error(
        `${this.tuya.device.id} - Error connecting to device: ${
          (<Error>ex).message
        }`
      );
      this.reconnect();
    }
  }

  private reconnect(): void {
    let _this = this;
    setTimeout(() => {
      if (_this.device.disabled) {
        return;
      }

      Logger.Info(`${_this.tuya.device.id} - trying to reconnect`);
      _this.connect();
    }, Configuration.instance.server().deviceReconnectWait);
  }

  async disconnect(): Promise<void> {
    await this.tuya.disconnect();
  }

  async set(
    data: ITuyaMultipleProperties | ITuyaSingleProperty
  ): Promise<{ [dps: string]: any }> {
    if (this.device.disabled) {
      return;
    }

    let response = await this.tuya.set(data);
    return response ? response.dps : {};
  }

  async status(): Promise<{ [dps: string]: any }> {
    if (this.device.disabled) {
      return {};
    }

    let data = await this.tuya.get({ schema: true });
    return data.dps;
  }

  toPublicDevice(): PublicDevice {
    return {
      id: this.tuya.device.id,
      name: this.device.name,
      ip: this.tuya.device.ip,
      productKey: this.tuya.device.productKey,
      apiVersion: this.tuya.device.version,
      isConnected: this.tuya.isConnected(),
      isDisabled: !!this.device.disabled,
    };
  }

  private onConnected(): void {
    Logger.Info(`${this.tuya.device.id} - connected`);
  }

  private onDisconnected(): void {
    Logger.Info(`${this.tuya.device.id} - disconnected`);
    this.reconnect();
  }

  private onError(error): void {
    Logger.Error(`${this.tuya.device.id} - error`, error);
  }

  private onData(data: ITuyaData): void {
    Logger.Debug(`${this.tuya.device.id} - data`, data);
    if (data.hasOwnProperty("dps")) {
      sendWebhook(this.tuya.device.id, data.dps);
    }
  }
}
