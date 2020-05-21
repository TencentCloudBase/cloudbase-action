export class CloudBaseContext {
    public readonly secretId: string
    public readonly secretKey: string
    public readonly token: string
    public readonly proxy: string
    public readonly envId: string

    constructor({ secretId = '', secretKey = '', token = '', proxy = '' }) {
        this.secretId = secretId
        this.secretKey = secretKey
        this.token = token
        this.proxy = proxy
    }
}
