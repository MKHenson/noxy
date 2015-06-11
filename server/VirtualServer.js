var colors = require("webinate-colors");
var http = require("http");
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
        var server = http.createServer(function (req, res) {
            // You can define here your custom logic to handle the request
            // and then proxy the request.
            proxy.web(req, res, { target: config.target });
        });
        // Listen on the port
        server.listen(config.port, function () {
            colors.log(colors.green("Virtual server running, listening on port " + config.port));
        });
    }
    return VirtualServer;
})();
exports.VirtualServer = VirtualServer;
