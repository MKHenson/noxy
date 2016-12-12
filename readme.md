# noxy
Noxy is a node based proxy service, configurable through a config file. The underlying proxy module is based on [http-proxy](https://github.com/nodejitsu/node-http-proxy)
by nodejitsu.

## Current stable version
* v0.2.2

## Requirements
* Node > v6
* Gulp

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

5) Install the dependencies

```
npm install
```

6) Run the build task. This will create a dist folder with an example config file. You
will need to run noxy from this folder. After the project is built, you will also need to
install npm dependencies from that folder.

```
gulp build
cd ./dist
npm install
```

6) Starting noxy: The example config is not very useful and has to be tailored to your needs.
But don't edit the example-config.json file, instead copy it and pass in your copy file on startup.
```
node Main.js --config="my-copy-example-config.json" --logging="true" --logFile="logs.log"
```

By default noxy will run using all threads available to your application. If however memory is in short supply you
can set the number of threads in the command line. Note that it's more useful to debug with 1 thread.

```
node Main.js --config="config.json" --numThreads="max" --logging="true" --logFile="logs.log"
node Main.js --config="config.json" --numThreads="1" --logging="true" --logFile="logs.log"
```

## Setting up the paths

You can find a detailed breakdown of all config options in the definition [file](./src/definitions/custom/config.d.ts).
Below is an example file that demonstrates a potential setup using a mixture of http endpoints as well as a web socket rules

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
