import * as proxyServer from "http-proxy";
import * as fs from "fs";
import * as http from "http";
import {VirtualServer} from "./VirtualServer";
import * as winston from "winston";
import * as yargs from "yargs";
import {IConfigFile} from "noxy";

var args = yargs.argv;

// Add the console colours
winston.addColors({ debug: 'green', info: 'cyan', silly: 'magenta', warn: 'yellow', error: 'red' });
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, <any>{ level: 'debug', colorize: true });

// Saves logs to file
if (args.logFile && args.logFile.trim() != "")
    winston.add(winston.transports.File, <winston.TransportOptions>{ filename: args.logFile, maxsize: 50000000, maxFiles: 1, tailable: true });

// If no logging - remove all transports
if (args.logging && args.logging.toLowerCase().trim() == "false")
{
    winston.remove(winston.transports.File);
    winston.remove(winston.transports.Console);
}

// Start logging th process
winston.info("Attempting to start up proxy server...", { process: process.pid });

// Make sure the config path argument is there
if (!args.config || args.config.trim() == "")
{
    winston.error("No config file specified. Please start noxy with the config path in the argument list. Eg: node Main.js --config=\"./config.js\"", { process: process.pid });
    process.exit();
}

// Make sure the file exists
if (!fs.existsSync(args.config))
{
    winston.error(`Could not locate the config file at '${args.config}'`, { process: process.pid });
    process.exit();
}

// We have a valid file path, now lets try load it...
var configPath: string = args.config;
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

