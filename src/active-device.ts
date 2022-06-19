import TuyAPI from 'tuyapi';

export default class ActiveDevice{

    tuya: TuyAPI;

    constructor(id: string, key: string) {
        this.tuya = new TuyAPI({
            id: id,
            key: key
        });
    }

    async connect(): Promise<void>{
        this.tuya.on('connected', this.onConnected);
        this.tuya.on('disconnected', this.onDisconnected);
        this.tuya.on('error', this.onError);
        this.tuya.on('data', this.onData);

        await this.tuya.find();
        await this.tuya.connect();
    }

    async disconnect() : Promise<void>{
        await this.tuya.disconnect();
    }

    private onConnected(): void{
        console.log('Connected to device!');
    }

    private onDisconnected(): void{
        console.log('Disconnected from device.');
    }

    private onError(error): void{
        console.log('Error!', error);
    }

    private onData(data): void{
        console.log('Data from device:', data);
    }
}