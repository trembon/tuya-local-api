export interface TuyaSetPropertiesMultiple{
    multiple: boolean;
    data: { [dps: string]: any };
}

export interface TuyaSetPropertiesSingle{
    dps: number;
    set: any;
}

export interface TuyaData{
    devId: string;
    dps: { [dps: string]: any };
    t: number;
}