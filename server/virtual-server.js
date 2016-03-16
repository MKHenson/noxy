"use strict";
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
    function VirtualServer(proxy, serverConfig) {
        this._proxy = proxy;
        this._cfg = serverConfig;
        this._pid = process.pid;
        var pid = this._pid;
        // If we use SSL then start listening for that as well
        if (serverConfig.ssl) {
            if (serverConfig.sslIntermediate != "" && !fs.existsSync(serverConfig.sslIntermediate)) {
                winston.error("Could not find sslIntermediate: '" + serverConfig.sslIntermediate + "'", { process: this._pid });
                process.exit();
            }
            if (serverConfig.sslCert != "" && !fs.existsSync(serverConfig.sslCert)) {
                winston.error("Could not find sslIntermediate: '" + serverConfig.sslCert + "'", { process: this._pid });
                process.exit();
            }
            if (serverConfig.sslRoot != "" && !fs.existsSync(serverConfig.sslRoot)) {
                winston.error("Could not find sslIntermediate: '" + serverConfig.sslRoot + "'", { process: this._pid });
                process.exit();
            }
            if (serverConfig.sslKey != "" && !fs.existsSync(serverConfig.sslKey)) {
                winston.error("Could not find sslIntermediate: '" + serverConfig.sslKey + "'", { process: this._pid });
                process.exit();
            }
            var caChain = [fs.readFileSync(serverConfig.sslIntermediate), fs.readFileSync(serverConfig.sslRoot)];
            var privateKey = serverConfig.sslKey ? fs.readFileSync(serverConfig.sslKey) : null;
            var theCert = serverConfig.sslCert ? fs.readFileSync(serverConfig.sslCert) : null;
            console.log("Attempting to start SSL server...");
            // Create server and listen on the port
            var httpsServer = https.createServer({ key: privateKey, cert: theCert, passphrase: serverConfig.sslPassPhrase, ca: caChain }, this.onServerRequest.bind(this));
            httpsServer.listen(serverConfig.sslPort, function () {
                winston.info("Virtual secure server running, listening on port " + serverConfig.port, { process: pid });
            });
        }
        // Create server and listen on the port
        var server = http.createServer(this.onServerRequest.bind(this));
        server.listen(serverConfig.port, function () {
            winston.info("Virtual server running, listening on port " + serverConfig.port, { process: pid });
        });
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
            var fullURI = (req.connection.encrypted ? "https" : "http") + "://" + req.headers.host + req.url;
            // You can define here your custom logic to handle the request
            // and then proxy the request.
            for (var i = 0, l = this._cfg.routes.length; i < l; i++) {
                if (fullURI.match(new RegExp(cfg.routes[i].path))) {
                    winston.info("Received: '" + fullURI + "' from '" + (req.headers.referer ? req.headers.referer : "") + "', redirecting to '" + cfg.routes[i].target + "'", { process: this._pid });
                    if (cfg.routes[i].redirects) {
                        res.writeHead(302, { 'Location': cfg.routes[i].target + "/" + (cfg.routes[i].keepPathURI ? req.url : "") });
                        res.end();
                    }
                    else {
                        proxy.web(req, res, {
                            target: cfg.routes[i].target,
                            secure: cfg.routes[i].secure
                        });
                    }
                    return;
                }
            }
        }
        else
            res.end("Host not recognised");
    };
    return VirtualServer;
}());
exports.VirtualServer = VirtualServer;
