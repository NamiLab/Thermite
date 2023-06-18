<img src="gitassets/therm2.png" width=130px>

# Thermite

**Disposable account-less one-time use script loading service with memory-only storage and a RESTful API for Roblox**

## Run, build and test Thermite

First time clone? Use this command: 
```bash
chmod +x ./setup.sh ; ./setup.sh
```

To build and run Thermite for testing, use the following command: 
```bash
npm run builderman
```

To build Thermite, use the following command: 
```bash
npm run build
```

To start Thermite, use the following command: 
```bash
npm run start
```

## Using the Thermite API to deploy your first disposable script

JavaScript example using Axios:
```js
const axios = require("axios");

axios.post("http://localhost:3000/api/deploy", { // You can also append the "burntime" query parameter to the URL to specify a custom burn time in milliseconds (When the script will be self-destructed)
	script: `print("Hello, world!")`
}).then((res) => {
	console.log(res.data);
}).catch((err) => {
	console.error(err);
});
```

Response: 
```javascript
{
	"message": "Script deployed",
	"burnTime": "100000",
	"scriptId": "nqwKIHPJMWVn6hnKjiua3dvRy2F4QlP46BEg9DacdS3HWRtbv63Of8cSAx9bF9biI58IQwMbciBEhzBiJT4sfBokNvUdbz3TgWgV"
}
```

## Reading the script

JavaScript example using Axios:
```js
const axios = require("axios");

axios.get("http://localhost:3000/api/use/nqwKIHPJMWVn6hnKjiua3dvRy2F4QlP46BEg9DacdS3HWRtbv63Of8cSAx9bF9biI58IQwMbciBEhzBiJT4sfBokNvUdbz3TgWgV").then((res) => {
	console.log(res.data);
}).catch((err) => {
	console.error(err);
});
```

Response: 
```lua
print("Hello, world!")
```
If the deployed script is deleted, this response will be returned instead: 
```javascript
{
	"error": "Script not found"
}
```

> **Note**: 
> The script will be automatically deleted after the burn time has passed (Default burn time is 120 seconds), or if the script is used once.
> Another thing to note is that if the fetch succeeds, the Content-Type will be `text/plain`, otherwise it will be `application/json`.
