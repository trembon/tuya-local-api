import fetch from 'node-fetch';
import Configuration from './configuration.js';
import Logger from './logger.js';

const sendWebhook = (deviceId, dps) => {
    let payload = JSON.stringify({
        deviceId: deviceId,
        data: dps,
    });

    let requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: payload,
    };

    Configuration.Webbhooks().forEach(url => {
        fetch(url, requestOptions)
        .then(response =>{
            Logger.Info(`Webhook - ${url} - ${response.status}`);
        })
        .catch(error => {
            Logger.Error(`Webhook - ${url} - ${error}`);
        });
    });
};

export default sendWebhook;