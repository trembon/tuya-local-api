import AsyncLock from "async-lock";
import ActiveDevice from "./active-device";
import Configuration from "./configuration";
import {
  ITuyaMultipleProperties,
  ITuyaSingleProperty,
} from "./interfaces/tuya";

let processQueueTimeout = undefined;
let queue: QueueItem[] = [];

let lock = new AsyncLock();

const queueAction = (
  device: ActiveDevice,
  data: ITuyaMultipleProperties | ITuyaSingleProperty
) => {
  lock.acquire("processQueue", () => {
    queue.push({ device, data });
    startTimeout();
  });
};

const startTimeout = () => {
  lock.acquire("processQueueTimeout", () => {
    if (!processQueueTimeout) {
      processQueueTimeout = setTimeout(
        processQueueItem,
        Configuration.instance.server().sendCommandDelay
      );
    }
  });
};

const processQueueItem = async () => {
  let queueItem: QueueItem;
  await lock.acquire("processQueue", () => {
    queueItem = queue.pop();
  });

  if (queueItem) {
    await queueItem.device.set(queueItem.data);
  }

  await lock.acquire("processQueueTimeout", () => {
    processQueueTimeout = undefined;
  });

  if (queueItem) {
    startTimeout();
  }
};

interface QueueItem {
  device: ActiveDevice;
  data: ITuyaMultipleProperties | ITuyaSingleProperty;
}

export default queueAction;
