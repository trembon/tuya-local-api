var config = {};

config.server = {};
config.devices = [];
config.webhooks = [];

config.server.port =  3000;
config.server.deviceReconnectWait = 5000;

config.devices.push({
    "id": "xxxxxxxx",
    "key": "xxxxxxxx",
    "apiVersion": 3.1
});

config.webhooks.push("http://localhost:4321/webhook");

export default config;