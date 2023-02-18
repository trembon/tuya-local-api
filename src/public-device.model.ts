export default interface PublicDevice{
    id: string;
    name?: string;
    ip: string;
    productKey: string;
    apiVersion: number;
    isConnected: boolean;
}