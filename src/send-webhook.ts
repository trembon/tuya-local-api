import fetch from "node-fetch";
import Configuration from "./configuration";
import Logger from "./logger";

const sendWebhook = (deviceId: string, dps: { [dps: string]: any }) => {
  let payload = JSON.stringify({
    deviceId: deviceId,
    data: dps,
  });

  let requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  };

  Configuration.instance.webhooks().forEach((url) => {
    fetch(url, requestOptions)
      .then((response) => {
        Logger.Info(`Webhook - ${url} - ${response.status}`);
      })
      .catch((error) => {
        Logger.Error(`Webhook - ${url} - ${error}`);
      });
  });
};

export default sendWebhook;
