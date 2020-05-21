export declare class CloudBaseContext {
    readonly secretId: string;
    readonly secretKey: string;
    readonly token: string;
    readonly proxy: string;
    readonly envId: string;
    constructor({ secretId, secretKey, token, proxy }: {
        secretId?: string;
        secretKey?: string;
        token?: string;
        proxy?: string;
    });
}
