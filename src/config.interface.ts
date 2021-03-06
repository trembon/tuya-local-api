export interface Config{
    server: ConfigServer;
    devices: ConfigDevice[];
}

export interface ConfigServer {
    port: number;
}

export interface ConfigDevice{
    id: string;
    key: string;
}