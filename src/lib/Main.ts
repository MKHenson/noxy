import * as colors from "webinate-colors";
import * as proxyServer from "http-proxy";
import * as fs from "fs";
import * as http from "http";
import {VirtualServer} from "./VirtualServer";

colors.log(colors.yellow("Attempting to start up proxy server..."));

// Make sure the config path argument is there
if (process.argv.length < 3)
{
    colors.log(colors.red("No config file specified. Please start noxy with the config path in the argument list. Eg: node Main.js ./config.js"));
    process.exit();
}

// Make sure the file exists
if (!fs.existsSync(process.argv[2]))
{
    colors.log(colors.red(`Could not locate the config file at '${process.argv[2]}'`));
    process.exit();
}

// We have a valid file path, now lets try load it...
var configPath : string = process.argv[2];
var config: any;

try
{
    // Load config
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
}
catch (err)
{
    colors.log(colors.red(err));
    process.exit();
}

// Creating the proxy
var proxy = proxyServer.createProxyServer();

try 
{
    // Now create each of the virtual servers
    for (var i = 0, l = config.proxies.length; i < l; i++)
        new VirtualServer(proxy, config.proxies[i]);
}
catch (err)
{
    colors.log(colors.red(err));
    process.exit();
}