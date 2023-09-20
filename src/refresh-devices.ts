import ActiveDevice from "./active-device";
import Configuration from "./configuration";
import Logger from "./logger";

let refreshDevicesInterval = undefined;
const refreshDevices = (activeDevices: { [id: string]: ActiveDevice }) => {
  if (refreshDevicesInterval) {
    clearInterval(refreshDevicesInterval);
    refreshDevicesInterval = undefined;
  }

  const refreshTime = Configuration.instance.server().refreshTime;
  if (refreshTime && refreshTime > 0) {
    refreshDevicesInterval = setInterval(() => {
      for (const key in activeDevices) {
        try {
          activeDevices[key].refresh();
        } catch (ex: unknown) {
          Logger.Error(
            `${activeDevices[key].tuya.device.id} - Error refreshing device: ${
              (<Error>ex).message
            }`
          );
        }
      }
    }, refreshTime);
  }
};

export default refreshDevices;
