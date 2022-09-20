import TuyAPI from 'tuyapi';
import Configuration from './configuration.js';
import Logger from './logger.js';
import PublicDevice from './public-device.model.js';
import sendWebhook from './send-webhook.js';
import { TuyaSetPropertiesMultiple, TuyaSetPropertiesSingle } from './tuya.interface.js';

export default class ActiveDevice {

    tuya: TuyAPI;

    constructor(id: string, key: string) {
        this.tuya = new TuyAPI({
            id: id,
            key: key,
            issueGetOnConnect: false
        });

        this.tuya.on('connected', () => this.onConnected());
        this.tuya.on('disconnected', () => this.onDisconnected());
        this.tuya.on('error', (error) => this.onError(error));
        this.tuya.on('data', (data) => this.onData(data));
    }

    async connect(): Promise<void> {
        try {
            await this.tuya.find();
            await this.tuya.connect();
        } catch (ex: unknown) {
            Logger.Error(`${this.tuya.device.id} - Error connecting to device: ${(<Error>ex).message}`);
            this.reconnect();
        }
    }

    private reconnect(): void{
        let _this = this;
        setTimeout(() => {
            Logger.Info(`${_this.tuya.device.id} - trying to reconnect`);
            _this.connect();
        }, Configuration.Server().deviceReconnectWait);
    }

    async disconnect(): Promise<void> {
        await this.tuya.disconnect();
    }

    async set(data: TuyaSetPropertiesMultiple | TuyaSetPropertiesSingle): Promise<void> {
        await this.tuya.set(data);
    }

    toPublicDevice(): PublicDevice {
        return {
            id: this.tuya.device.id,
            ip: this.tuya.device.ip,
            productKey: this.tuya.device.productKey,
            isConnected: this.tuya.isConnected()
        }
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

    private onData(data): void {
        Logger.Debug(`${this.tuya.device.id} - data`, data);
        if(data.hasOwnProperty('dps')){
            sendWebhook(this.tuya.device.id, data.dps);
        }
    }
}