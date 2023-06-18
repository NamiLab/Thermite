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

axios.post("http://localhost:3000/api/deploy", {
	script: `print("Hello, world!")`
}).then((res) => {
	console.log(res.data);
}).catch((err) => {
	console.error(err);
});
```

Response: 
```javascript
...
```
