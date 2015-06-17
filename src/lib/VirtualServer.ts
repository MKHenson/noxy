import * as http from "http";
import * as https from "https";
import {Proxy, ProxyServerOptions} from "http-proxy";
import {IConfig, IConfigFile} from "./Config";
import * as fs from "fs";
import * as winston from "winston";

/**
* A virtual server that proxies its requests to other ports
*/
export class VirtualServer
{
    private _proxy: Proxy;
    private _cfg: IConfig;
    private _pid: number;

    /**
    * Creates an instance of the virtual server
    * @param {Proxy} proxy The proxy forwaring on the calls
    * @param {any} config The configuration of this virtual server
    */
    constructor(proxy: Proxy, serverConfig: IConfig )
    {
        this._proxy = proxy;
        this._cfg = serverConfig;
        this._pid = process.pid;
        var pid = this._pid;

        // If we use SSL then start listening for that as well
        if (serverConfig.ssl)
        {
            if (serverConfig.sslIntermediate != "" && !fs.existsSync(serverConfig.sslIntermediate))
            {
                winston.error(`Could not find sslIntermediate: '${serverConfig.sslIntermediate}'`, { process: this._pid });
                process.exit();
            }

            if (serverConfig.sslCert != "" && !fs.existsSync(serverConfig.sslCert))
            {
                winston.error(`Could not find sslIntermediate: '${serverConfig.sslCert}'`, { process: this._pid });
                process.exit();
            }

            if (serverConfig.sslRoot != "" && !fs.existsSync(serverConfig.sslRoot))
            {
                winston.error(`Could not find sslIntermediate: '${serverConfig.sslRoot}'`, { process: this._pid });
                process.exit();
            }

            if (serverConfig.sslKey != "" && !fs.existsSync(serverConfig.sslKey))
            {
                winston.error(`Could not find sslIntermediate: '${serverConfig.sslKey}'`, { process: this._pid });
                process.exit();
            }

            var caChain = [fs.readFileSync(serverConfig.sslIntermediate), fs.readFileSync(serverConfig.sslRoot)];
            var privateKey = serverConfig.sslKey ? fs.readFileSync(serverConfig.sslKey) : null;
            var theCert = serverConfig.sslCert ? fs.readFileSync(serverConfig.sslCert) : null;

            console.log(`Attempting to start SSL server...`);

            // Create server and listen on the port
            var httpsServer = https.createServer({ key: privateKey, cert: theCert, passphrase: serverConfig.sslPassPhrase, ca: caChain }, this.onServerRequest.bind(this));
            httpsServer.listen(serverConfig.port, function ()
            {
                winston.info(`Virtual secure server running, listening on port ${serverConfig.port}`, { process: pid });
            });
        }
        else
        {
            // Create server and listen on the port
            var server = http.createServer(this.onServerRequest.bind(this));
            server.listen(serverConfig.port, function()
            {
                winston.info(`Virtual server running, listening on port ${serverConfig.port}`, { process: pid });
            });
        }
    }

    /**
    * Creates an instance of the virtual server
    * @param {Proxy} proxy The proxy forwaring on the calls
    * @param {any} config The configuration of this virtual server
    */
    onServerRequest(req: http.ServerRequest, res: http.ServerResponse)
    {
        if (req.headers && req.headers.host)
        {
            var cfg = this._cfg;
            var proxy = this._proxy;
            var fullURI: string = `${((<any>req.connection).encrypted ? "http" : "htts")}://${req.headers.host}${req.url}`;
            
            // You can define here your custom logic to handle the request
            // and then proxy the request.
            for (var i = 0, l = this._cfg.routes.length; i < l; i++)
            {
                if (fullURI.match(new RegExp(cfg.routes[i].path)))
                {
                    winston.info(`Received: '${fullURI}' from '${(req.headers.referer ? req.headers.referer : "") }', redirecting to '${cfg.routes[i].target}'`, { process: this._pid });

                    if (cfg.routes[i].redirects)
                    {
                        res.writeHead(302, { 'Location': `${cfg.routes[i].target}/${(cfg.routes[i].keepPathURI ? req.url : "" )}` });
                        res.end();
                    }
                    else
                    {
                        proxy.web(req, res, <ProxyServerOptions>{
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
    }
}