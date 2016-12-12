
declare module Noxy {
    export interface IConfig {
        /**
         * The port noxy listens on for incomming requests
         * Eg: 80
         */
        port: number;

        /**
         * If true, noxy will setup both a regular and secure port.
         * Eg: true/false
         */
        ssl?: boolean;

        /**
         * The SSL intermediate file path. Only applicable if ssl is true
         * Eg: './ssl/intermediate'
         */
        sslIntermediate?: string;

        /**
         * The SSL root file path. Only applicable if ssl is true
         * Eg: './ssl/root'
         */
        sslRoot?: string;

        /**
         * The SSL certificate file path. Only applicable if ssl is true
         * Eg: './ssl/cert'
         */
        sslCert?: string;

        /**
         * The SSL key file path. Only applicable if ssl is true
         * Eg: './ssl/key'
         */
        sslKey?: string;

        /**
         * The SSL passphrase. Only applicable if ssl is true
         * Eg: 'password'
         */
        sslPassPhrase?: string;

        /**
         * The SSL port to listen on
         * Eg: 443
         */
        sslPort: number;

        /**
         * An array of routes and their respective proxy targets
         *  - path: The regex string we use to test a requests
         *  - target: The proxy target URI
         *  - secure: A Boolean to indicate if the request must be secure or not
         *  - redirects: A Boolean to indicate if noxy should redirect a request (sending a 302) as opposed to a pure proxy
         *  - keepPathURI: A boolean to indicate if the proxy should maintain the URI (simply swap out the host with the target). Default is true.
         *  - isSocket: A boolean to indicate if the route should be treated as a socket. Default is false.
         * Eg:
         * [
         *   { "path": "domain-test\\.com", "target": "http://localhost:5001" },
         *   { "path": "admin\\.domain-test\\.com", "target": "http://localhost:8003" },
         *   { "path": "api\\.domain-test\\.com", "target": "http://localhost:8002" },
         *   { "path": "test\\.net", "target": "http://localhost:8001", "redirects": true },
         *   { "path": "test\\.dev\/sockets", "target": "ws://localhost:3000", "isSocket": true },
         *   { "path": "test\\.dev\/api\/v1", "target": "http://localhost:5000" },
         *   { "path": "test\\.dev\/api\/v2", "target": "http://localhost:8000" },
         *   { "path": "test\\.dev\/api\/v3", "target": "https://localhost:7000", "secure": true }
         * ]
         */
        routes: Array<{
            path: string;
            target: string;
            secure: boolean;
            redirects: boolean;
            keepPathURI: boolean;
            isSocket?: boolean;
        }>;
    }

    export interface IConfigFile {
        proxies: Array<IConfig>;
    }
}

declare module "noxy"
{
    export = Noxy;
}