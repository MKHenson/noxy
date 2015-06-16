# noxy
Noxy is a node based proxy service, configurable through a config file

## Current stable version
* v0.0.5

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
node Main.js config.json
```