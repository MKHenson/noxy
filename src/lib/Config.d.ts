export interface IConfig
{
    port: number;
    ssl?: boolean;
    sslIntermediate?: string;
    sslRoot?: string;
    sslCert?: string;
    sslKey?: string;
    sslPassPhrase?: string;
    routes: Array<{
        path: string;
        target: string;
        secure: boolean;
    }>;
}

export interface IConfigFile
{
    proxies: Array<IConfig>;
}