import { IConfigDevice } from "./device";
import { IConfigServer } from "./server";

export interface IConfig {
  server: IConfigServer;
  devices: IConfigDevice[];
  webhooks: string[];
}
