
declare module Noxy
{
    export interface IConfig
    {
        port: number;
        ssl?: boolean;
        sslIntermediate?: string;
        sslRoot?: string;
        sslCert?: string;
        sslKey?: string;
        sslPassPhrase?: string;
        sslPort: number;
        routes: Array<{
            path: string;
            target: string;
            secure: boolean;
            redirects: boolean;
            keepPathURI: boolean;
        }>;
    }

    export interface IConfigFile
    {
        proxies: Array<IConfig>;
    }
}

declare module "noxy"
{
    export = Noxy;
}