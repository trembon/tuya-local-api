import express from "express";
import ActiveDevice from "./active-device";
import Configuration from "./configuration";
import {
  ITuyaMultipleProperties,
  ITuyaSingleProperty,
} from "./interfaces/tuya";
import Logger from "./logger";
import processDevices from "./process-devices";
import PublicDevice from "./public-device.model";
import refreshDevices from "./refresh-devices";
import queueAction from "./action-queue";

Logger.Info(`Starting`);

let devices: { [id: string]: ActiveDevice } = {};

const config = new Configuration(async () => {
  processDevices(devices);
  refreshDevices(devices);
});
config.initialize();

const app = express();
app.use(express.json());

const port = config.server().port ?? 3000;

processDevices(devices);
refreshDevices(devices);

app.get("/", (req, res) => {
  res.json([
    {
      url: "/devices",
      method: "GET",
      info: "List all devices",
    },
    {
      url: "/devices/:deviceId/status",
      method: "GET",
      info: "Get the current status of the device as DPS values. Ex id: 02345000a12b123b12cd",
    },
    {
      url: "/devices/:deviceId/send",
      method: "POST",
      info: "Send a command to the specified device. Ex id: 02345000a12b123b12cd",
    },
  ]);
});

app.get("/devices", async (req, res) => {
  let response: PublicDevice[] = [];
  for (let key in devices) {
    response.push(devices[key].toPublicDevice());
  }
  res.json(response);
});

app.get("/devices/:deviceId/status", async (req, res) => {
  const device = devices[req.params.deviceId];
  if (!device) {
    res.sendStatus(404);
    return;
  }

  let status = await device.status();
  res.json(status);
});

app.post("/devices/:deviceId/send", async (req, res) => {
  const device = devices[req.params.deviceId];
  if (!device) {
    res.sendStatus(404);
    return;
  }

  let action = req.body;
  if (!action) {
    res.sendStatus(400);
    return;
  }

  if (action.hasOwnProperty("dps") && action.hasOwnProperty("set")) {
    for (var key in action) {
      if (action.hasOwnProperty(key) && !(key === "dps" || key === "set")) {
        delete action[key];
      }
    }

    queueAction(device, <ITuyaSingleProperty>action);
    res.sendStatus(200);
  } else if (action.hasOwnProperty("data")) {
    for (var key in action) {
      if (action.hasOwnProperty(key) && key !== "data") {
        delete action[key];
      }
    }

    action.multiple = true;
    queueAction(device, <ITuyaMultipleProperties>action);
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

app.listen(port, () => {
  return Logger.Info(`Express is listening on port ${port}`);
});
