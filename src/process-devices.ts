import ActiveDevice from "./active-device";
import Configuration from "./configuration";
import Logger from "./logger";

const processDevices = (activeDevices: { [id: string]: ActiveDevice }) => {
  let deviceIdList: string[] = [];
  for (const key in activeDevices) {
    deviceIdList.push(activeDevices[key].device.id);
  }

  Configuration.instance.devices().forEach((device) => {
    if (deviceIdList.some(item => item === device.id)) {
      deviceIdList.splice(deviceIdList.indexOf(device.id), 1);

      const activeDevice = activeDevices[device.id];
      const oldConfiguration = activeDevice.device;
      activeDevice.device = device;

      if (oldConfiguration.disabled && !device.disabled) {
        Logger.Info(
          `Reloaded device with id '${device.id}', now trying to connect`
        );
        activeDevice.connect();
      }
      if (!oldConfiguration.disabled && device.disabled) {
        Logger.Info(
          `Reloaded device with id '${device.id}', now disconnecting`
        );
        activeDevice.disconnect();
      }
    } else {
      Logger.Info(`Adding device with id '${device.id}'`);
      const newActiveDevice = new ActiveDevice(device);
      newActiveDevice.connect();
      activeDevices[device.id] = newActiveDevice;
    }
  });

  deviceIdList.forEach((deviceId) => {
    Logger.Info(`Removing device with id '${deviceId}'`);
    activeDevices[deviceId].disconnect();
    delete activeDevices[deviceId];
  });
};

export default processDevices;
