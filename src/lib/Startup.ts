import * as proxyServer from "http-proxy";
import * as fs from "fs";
import * as http from "http";
import {VirtualServer} from "./VirtualServer";
import {IConfigFile} from "./Config";
import * as winston from "winston";
import * as yargs from "yargs";

var arguments = yargs.argv;

// Saves logs to file
if (arguments.logFile && arguments.logFile.trim() != "")
    winston.add(winston.transports.File, { filename: arguments.logFile, maxsize: 50000000, maxFiles: 1, tailable: true });

// If no logging - remove all transports
if (arguments.logging && arguments.logging.toLowerCase().trim() == "false")
{
    winston.remove(winston.transports.File);
    winston.remove(winston.transports.Console);
}

// Start logging th process
winston.info("Attempting to start up proxy server...", { process: process.pid });

// Make sure the config path argument is there
if (!arguments.config || arguments.config.trim() == "")
{
    winston.error("No config file specified. Please start noxy with the config path in the argument list. Eg: node Main.js --config=\"./config.js\"", { process: process.pid });
    process.exit();
}

// Make sure the file exists
if (!fs.existsSync(arguments.config))
{
    winston.error(`Could not locate the config file at '${arguments.config}'`, { process: process.pid });
    process.exit();
}

// We have a valid file path, now lets try load it...
var configPath: string = arguments.config;
var config: IConfigFile;

try
{
    // Load config
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
}
catch (err)
{
    winston.error(err.toString(), { process: process.pid });
    process.exit();
}



// Creating the proxy
var proxy = proxyServer.createProxyServer();

// Listen for the `error` event on `proxy`.
proxy.on("error", function (err: Error, req: http.ServerRequest, res: http.ServerResponse)
{
    res.writeHead(500, {
        "Content-Type": "text/plain"
    });

    res.end(err.message);
});

try 
{
    // Now create each of the virtual servers
    for (var i = 0, l = config.proxies.length; i < l; i++)
        new VirtualServer(proxy, config.proxies[i]);
}
catch (err)
{
    winston.error(err.toString(), { process: process.pid });
    process.exit();
}

