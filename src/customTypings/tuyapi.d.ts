import TuyAPI from "tuyapi";

interface ITuyAPI extends TuyAPI {
    device: ITuyAPIDevice;
}

interface ITuyAPIDevice {
    id: string;
    ip?: string;
    productKey: string;
    version: number;
}