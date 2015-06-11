// Type definitions for node-http-proxy
// https://github.com/nodejitsu/node-http-proxy

declare module "http-proxy" {

    export interface ProxyServerOptions
    {
        /*
        * url string to be parsed with the url module
        */
        target?: string;

        /*
        * url string to be parsed with the url module
        */
        forward?: string;

        /*
        * object to be passed to http(s).request
        */
        agent?: any;

        /*
        * object to be passed to https.createServer()
        */
        ssl?: any;

        /*
        * true/false, if you want to proxy websockets
        */
        ws?: boolean;

        /*
        * true/false, adds x-forward headers
        */
        xfwd?: boolean;

        /*
        * true/false, verify SSL certificate
        */
        secure?: boolean;

        /*
        * true/false, explicitly specify if we are proxying to another proxy
        */
        toProxy?: boolean;

        /*
        * true/false, Default: true - specify whether you want to prepend the target's path to the proxy path
        */
        prependPath?: boolean;

        /*
        * true/false, Default: false - specify whether you want to ignore the proxy path of the incoming request
        */
        ignorePath?: boolean;

        /*
        * Local interface string to bind for outgoing connections
        */
        localAddress?: string;

        /*
        * true/false, Default: false - changes the origin of the host header to the target URL
        */
        changeOrigin?: boolean;

        /*
        * Basic authentication i.e. 'user:password' to compute an Authorization header.  
        */
        auth?: string;

        /*
        * rewrites the location hostname on (301/302/307/308) redirects, Default: null.
        */
        hostRewrite?: any;

        /*
        * rewrites the location host/port on (301/302/307/308) redirects based on requested host/port. Default: false.
        */
        autoRewrite?: any;

        /*
        * rewrites the location protocol on (301/302/307/308) redirects to 'http' or 'https'. Default: null.
        */
        protocolRewrite?: any;
    }

    export interface Proxy
    {
        /**
        * Sends a http(s) request
        */
        web(req, res, options?: ProxyServerOptions, callback?: Function);

        /**
        * Sends a websocket request
        */
        ws(req, socket, head, options?: ProxyServerOptions);

        /**
        * Makes the proxy listen on a port
        */
        listen(port: number);

        /**
        * When testing or running server within another program it may be necessary to close the proxy.
        * This will stop the proxy from accepting new connections.
        */
        close();

        /**
        * Event listening
        */
        on(event: string, callback: Function);
    }

    /*
    *  NOTE: `options.ws` and `options.ssl` are optional.
    *  `options.target and `options.forward` cannot be
    *  both missing
    */
    export function createProxyServer(options?: ProxyServerOptions): Proxy;
}