import express from 'express';
import ActiveDevice from './active-device';
import { Config } from './config.interface';

const config: Config = require("../config.json");

const app = express();
const port = config.server.port ?? 3000;

let devices: ActiveDevice[] = [];
config.devices.forEach(d => {
    devices.push(new ActiveDevice(d.id, d.key));
});

devices.forEach(d => d.connect());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});