"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CloudBaseContext {
    constructor({ secretId = '', secretKey = '', token = '', proxy = '' }) {
        this.secretId = secretId;
        this.secretKey = secretKey;
        this.token = token;
        this.proxy = proxy;
    }
}
exports.CloudBaseContext = CloudBaseContext;
