var colors = require("webinate-colors");
var proxyServer = require("http-proxy");
var fs = require("fs");
var VirtualServer_1 = require("./VirtualServer");
colors.log(colors.yellow("Attempting to start up proxy server..."));
// Make sure the config path argument is there
if (process.argv.length < 3) {
    colors.log(colors.red("No config file specified. Please start noxy with the config path in the argument list. Eg: node Main.js ./config.js"));
    process.exit();
}
// Make sure the file exists
if (!fs.existsSync(process.argv[2])) {
    colors.log(colors.red("Could not locate the config file at '" + process.argv[2] + "'"));
    process.exit();
}
// We have a valid file path, now lets try load it...
var configPath = process.argv[2];
var config;
try {
    // Load config
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
}
catch (err) {
    colors.log(colors.red(err));
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
    colors.log(colors.red(err));
    process.exit();
}
