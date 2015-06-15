var colors = require("webinate-colors");
var http = require("http");
var https = require("https");
var fs = require("fs");
var winston = require("winston");
/**
* A virtual server that proxies its requests to other ports
*/
var VirtualServer = (function () {
    /**
    * Creates an instance of the virtual server
    * @param {Proxy} proxy The proxy forwaring on the calls
    * @param {any} config The configuration of this virtual server
    */
    function VirtualServer(proxy, config) {
        this._proxy = proxy;
        this._cfg = config;
        // If we use SSL then start listening for that as well
        if (config.ssl) {
            if (config.sslIntermediate != "" && !fs.existsSync(config.sslIntermediate)) {
                colors.log(colors.red("Could not find sslIntermediate: '" + config.sslIntermediate + "'"));
                process.exit();
            }
            if (config.sslCert != "" && !fs.existsSync(config.sslCert)) {
                colors.log(colors.red("Could not find sslIntermediate: '" + config.sslCert + "'"));
                process.exit();
            }
            if (config.sslRoot != "" && !fs.existsSync(config.sslRoot)) {
                colors.log(colors.red("Could not find sslIntermediate: '" + config.sslRoot + "'"));
                process.exit();
            }
            if (config.sslKey != "" && !fs.existsSync(config.sslKey)) {
                colors.log(colors.red("Could not find sslIntermediate: '" + config.sslKey + "'"));
                process.exit();
            }
            var caChain = [fs.readFileSync(config.sslIntermediate), fs.readFileSync(config.sslRoot)];
            var privateKey = config.sslKey ? fs.readFileSync(config.sslKey) : null;
            var theCert = config.sslCert ? fs.readFileSync(config.sslCert) : null;
            console.log("Attempting to start SSL server...");
            // Create server and listen on the port
            var httpsServer = https.createServer({ key: privateKey, cert: theCert, passphrase: config.sslPassPhrase, ca: caChain }, this.onServerRequest.bind(this));
            httpsServer.listen(config.port, function () {
                console.log("Virtual secure server running, listening on port " + config.port);
            });
        }
        else {
            // Create server and listen on the port
            var server = http.createServer(this.onServerRequest.bind(this));
            server.listen(config.port, function () {
                colors.log(colors.green("Virtual server running, listening on port " + config.port));
            });
        }
    }
    /**
    * Creates an instance of the virtual server
    * @param {Proxy} proxy The proxy forwaring on the calls
    * @param {any} config The configuration of this virtual server
    */
    VirtualServer.prototype.onServerRequest = function (req, res) {
        if (req.headers && req.headers.host) {
            var cfg = this._cfg;
            var proxy = this._proxy;
            var fullURI = req.headers.host + req.url;
            // You can define here your custom logic to handle the request
            // and then proxy the request.
            for (var i = 0, l = this._cfg.routes.length; i < l; i++) {
                if (fullURI.match(new RegExp(cfg.routes[i].path))) {
                    winston.log("info", "Received: '" + fullURI + "' from '" + (req.headers.referer ? req.headers.referer : "") + "', redirecting to '" + cfg.routes[i].target + "'");
                    proxy.web(req, res, {
                        target: cfg.routes[i].target,
                        secure: cfg.routes[i].secure
                    });
                }
            }
        }
        else
            res.end("Host not recognised");
    };
    return VirtualServer;
})();
exports.VirtualServer = VirtualServer;
