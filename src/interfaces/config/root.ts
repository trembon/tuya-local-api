import IConfigDevice from "./device";
import IConfigServer from "./server";

export default interface IConfig {
  server: IConfigServer;
  devices: IConfigDevice[];
  webhooks: string[];
}
