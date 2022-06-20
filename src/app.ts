import express from 'express';
import ActiveDevice from './active-device';
import { Config } from './config.interface';
import Logger from './logger';
import PublicDevice from './public-device.model';

const config: Config = require("../config.json");

Logger.Info(`Starting`);

const app = express();
const port = config.server.port ?? 3000;

let devices: { [id: string]: ActiveDevice } = {};
config.devices.forEach(d => {
    devices[d.id] = new ActiveDevice(d.id, d.key);
    devices[d.id].connect();
});

app.get('/', (req, res) => {
    res.json('Hello from TuyaLocalApi!');
});

app.get('/devices', (req, res) => {
    let response: PublicDevice[] = [];
    for (let key in devices) {
        response.push(devices[key].toPublicDevice());
    }
    res.json(response);
});

app.get('/devices/:deviceId/send/:command', (req, res) => {
    const device = devices[req.params.deviceId];
    if (!device) {
        res.sendStatus(404);
        return;
    }

    switch (req.params.command.toLowerCase()) {
        case 'turnon':
            device.set({ set: true });
            break;

        case 'turnoff':
            device.set({ set: false });
            break;

        default:
            res.sendStatus(404);
            return;
    }

    res.sendStatus(200);
});

app.listen(port, () => {
    return Logger.Info(`Express is listening on port ${port}`);
});