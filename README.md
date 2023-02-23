# tuya-local-api

Built to be used as a web api wrapper against the [TuyAPI](https://github.com/codetheweb/tuyapi) package, to work with Tuya devices offline and without their servers.

This wrapper will automatically try to keep a connection open to the configured devices by reconnecting to them when they get offline or if the device is offline during startup.

## Methods

### GET /devices

Lists all configured devices.

Example result:

``` json
[
    {
        "id": "id of the device",
        "name": "name of the device",
        "ip": "ip of the device",
        "productKey": "product key for the device",
        "isConnected": bool, // status of the device
        "isDisabled": bool // if the device is disabled from configuration
    }
]
```

### GET /devices/&lt;deviceId&gt;/status

Get the status in DPS values of the specified device.

Example result:

``` json
{
    "20": false,
    "21": "white",
    "22": 1000,
    "23": 348,
    "24": "00df03e803e8",
    "25": "020e0d0000000000000003e803e8",
    "26": 0
}
```

### POST /devices/&lt;deviceId&gt;/send

Send a command to the specified device.
Response will be 200 OK if successfull.

Example body:

``` json
{
    "dps": "property to set, ex: 1 or 2",
    "set": "value to set"
}

{
    "data": {
        "<propertyId>": "value to set"
    }
}
```

``` json
{
    "dps": "1",
    "set": true
}

{
    "data": {
        "1": true
    }
}
```

## Configuration

Basic example of the configuration (config.json) file.

``` json
{
  "server": {
    "port": 3000,
    "deviceReconnectWait": 5000
  },
  "webhooks": ["http://localhost:4321/webhook"],
  "devices": [
    {
      "id": "xxxxxxxx",
      "name": "OnlyForDisplay",
      "key": "xxxxxxxx",
      "apiVersion": 3.3,
      "disabled": false
    }
  ]
}

```

## Getting device id/key

Use [TuyaCLI](https://github.com/TuyaAPI/cli) and if help is needed this [guide](https://github.com/codetheweb/tuyapi/blob/master/docs/SETUP.md) can be helpful.
