export interface TuyaSetPropertiesMultiple{
    multiple: boolean;
    data: { [dps: string]: any };
}

export interface TuyaSetPropertiesSingle{
    dps: number;
    set: any;
}