import express from 'express';
import ActiveDevice from './active-device.js';
import Configuration from './configuration.js';
import Logger from './logger.js';
import PublicDevice from './public-device.model.js';
import { TuyaSetPropertiesMultiple, TuyaSetPropertiesSingle } from './tuya.interface.js';

Logger.Info(`Starting`);

const app = express();
app.use(express.json());

const port = Configuration.Server().port ?? 3000;

let devices: { [id: string]: ActiveDevice } = {};
Configuration.Devices().forEach(d => {
    devices[d.id] = new ActiveDevice(d.id, d.key);
    devices[d.id].connect();
});

app.get('/', (req, res) => {
    res.json([
        {
            'url': '/devices',
            'info': 'List all devices'
        }, {
            'url': '/devices/:deviceId/send',
            'info': 'Send a command to the specified device. Ex id: 02345000a12b123b12cd'
        },
    ]);
});

app.get('/devices', (req, res) => {
    let response: PublicDevice[] = [];
    for (let key in devices) {
        response.push(devices[key].toPublicDevice());
    }
    res.json(response);
});

app.post('/devices/:deviceId/send', (req, res) => {
    const device = devices[req.params.deviceId];
    if (!device) {
        res.sendStatus(404);
        return;
    }

    let action = req.body;
    console.log('BODY:', action);
    if (!action) {
        res.sendStatus(400);
        return;
    }

    if (action.hasOwnProperty('dps') && action.hasOwnProperty('set')) {
        for (var key in action) {
            if (action.hasOwnProperty(key) && !(key === 'dps' || key === 'set')) {
                delete action[key];
            }
        }

        device.set(<TuyaSetPropertiesSingle>action);
        res.sendStatus(200);
    } else if (action.hasOwnProperty('data')) {
        for (var key in action) {
            if (action.hasOwnProperty(key) && key !== 'data') {
                delete action[key];
            }
        }

        action.multiple = true;
        device.set(<TuyaSetPropertiesMultiple>action);
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

app.listen(port, () => {
    return Logger.Info(`Express is listening on port ${port}`);
});