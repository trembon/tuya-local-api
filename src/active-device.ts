import TuyAPI from 'tuyapi';
import Logger from './logger';
import PublicDevice from './public-device.model';

export default class ActiveDevice {

    tuya: TuyAPI;

    constructor(id: string, key: string) {
        this.tuya = new TuyAPI({
            id: id,
            key: key
        });
    }

    async connect(): Promise<void> {
        this.tuya.on('connected', () => this.onConnected());
        this.tuya.on('disconnected', () => this.onDisconnected());
        this.tuya.on('error', (error) => this.onError(error));
        this.tuya.on('data', (data) => this.onData(data));

        await this.tuya.find();
        await this.tuya.connect();
    }

    async disconnect(): Promise<void> {
        await this.tuya.disconnect();
    }

    async set(data: any): Promise<void> {
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
    }

    private onError(error): void {
        Logger.Error(`${this.tuya.device.id} - error`, error);
    }

    private onData(data): void {
        Logger.Debug(`${this.tuya.device.id} - data`, data)
    }
}