"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./auth");
const http_request_1 = require("./http-request");
async function cloudBaseRequest(options) {
    const url = 'https://tcb-admin.tencentcloudapi.com/admin';
    const { config, params = {}, method = 'POST', headers = {} } = options;
    const requestData = Object.assign(Object.assign({}, params), { envName: config.envId, timestamp: Date.now() });
    const requestHeaders = Object.assign(Object.assign({}, headers), { 'content-type': 'application/json', 'user-agent': `cloudbase-manager-node/0.1.0`, 'x-tcb-source': 'cloudbase-manager-node, not-scf' });
    const { secretId, secretKey, token, proxy } = config;
    const authData = {
        secretId,
        secretKey,
        method: method,
        pathname: '/admin',
        params: requestData,
        headers: requestHeaders
    };
    const authorization = auth_1.getAuth(authData);
    const requestBody = Object.assign(Object.assign({}, requestData), { sessionToken: token, authorization });
    const res = await http_request_1.fetch(url, {
        method,
        body: JSON.stringify(requestBody),
        headers: requestHeaders
    }, process.env.TCB_ADMIN_PROXY || proxy);
    return res;
}
exports.cloudBaseRequest = cloudBaseRequest;
