# noxy
Noxy is a node based proxy service, configurable through a config file. The underlying proxy module is based on (http-proxy)[https://github.com/nodejitsu/node-http-proxy]
by nodejitsu.

## Current stable version
* v0.1.1

## Requirements
* Node
* **Tested Ubuntu v14**

## Installation

1) Make sure the requirements are installed and running
2) Create a folder where you want to store noxy and go into that folder

```
mkdir noxy
cd noxy
```

3) Run as an admin / or make sure you have write privileges in the noxy folder
```
sudo su
```

4) Download and install the desired version from github

If you want the latest stable version:

```
curl -o- https://raw.githubusercontent.com/MKHenson/noxy/master/install-script.sh | bash
```

OR if you want the dev build

```
curl -o- https://raw.githubusercontent.com/MKHenson/noxy/dev/install-script-dev.sh | bash
```

5) To start noxy
```
node Main.js --config="config.json" --logging="true" --logFile="logs.log"
```

By default noxy will run using all threads available to your application. If however memory is in short supply you
can set the number of threads in the command line

```
node Main.js --config="config.json" --numThreads="max" --logging="true" --logFile="logs.log"
node Main.js --config="config.json" --numThreads="4" --logging="true" --logFile="logs.log"
```

## Setting up the paths

You can find a detailed breakdown of all config options in the definition (file)[./src/definitions/custom/config.d.ts].
Below is an example file that demonstrates a potential setup using a mixture of http endpoints as well as a web socket rule

```
{
  "proxies": [
    {
      "port": 80,
      "ssl": false,
      "sslIntermediate": "",
      "sslRoot": "",
      "sslCert": "",
      "sslKey": "",
      "sslPassPhrase": "",
      "sslPort": 443,
      "routes": [
        { "path": "domain-test\\.com", "target": "http://localhost:5001" },
		{ "path": "admin\\.domain-test\\.com", "target": "http://localhost:8003" },
        { "path": "api\\.domain-test\\.com", "target": "http://localhost:8002" },
		{ "path": "test\\.net", "target": "http://localhost:8001", "redirects": true },
		{ "path": "test\\.dev\/sockets", "target": "ws://localhost:3000", "isSocket": true },
		{ "path": "test\\.dev\/api\/v1", "target": "http://localhost:5000" },
		{ "path": "test\\.dev\/api\/v2", "target": "http://localhost:8000" },
        { "path": "test\\.dev\/api\/v3", "target": "https://localhost:7000", "secure": true }
      ]
    }
  ]
}
```
