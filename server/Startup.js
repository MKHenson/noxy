"use strict";
var proxyServer = require("http-proxy");
var fs = require("fs");
var VirtualServer_1 = require("./VirtualServer");
var winston = require("winston");
var yargs = require("yargs");
var args = yargs.argv;
// Saves logs to file
if (args.logFile && args.logFile.trim() != "")
    winston.add(winston.transports.File, { filename: args.logFile, maxsize: 50000000, maxFiles: 1, tailable: true });
// If no logging - remove all transports
if (args.logging && args.logging.toLowerCase().trim() == "false") {
    winston.remove(winston.transports.File);
    winston.remove(winston.transports.Console);
}
// Start logging th process
winston.info("Attempting to start up proxy server...", { process: process.pid });
// Make sure the config path argument is there
if (!args.config || args.config.trim() == "") {
    winston.error("No config file specified. Please start noxy with the config path in the argument list. Eg: node Main.js --config=\"./config.js\"", { process: process.pid });
    process.exit();
}
// Make sure the file exists
if (!fs.existsSync(args.config)) {
    winston.error("Could not locate the config file at '" + args.config + "'", { process: process.pid });
    process.exit();
}
// We have a valid file path, now lets try load it...
var configPath = args.config;
var config;
try {
    // Load config
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
}
catch (err) {
    winston.error(err.toString(), { process: process.pid });
    process.exit();
}
// Creating the proxy
var proxy = proxyServer.createProxyServer();
// Listen for the `error` event on `proxy`.
proxy.on("error", function (err, req, res) {
    res.writeHead(500, {
        "Content-Type": "text/plain"
    });
    res.end(err.message);
});
try {
    // Now create each of the virtual servers
    for (var i = 0, l = config.proxies.length; i < l; i++)
        new VirtualServer_1.VirtualServer(proxy, config.proxies[i]);
}
catch (err) {
    winston.error(err.toString(), { process: process.pid });
    process.exit();
}
