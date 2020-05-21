"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const url_1 = require("url");
const query_string_1 = __importDefault(require("query-string"));
const error_1 = require("../error");
const http_request_1 = require("./http-request");
const constant_1 = require("../constant");
const utils_1 = require("../utils");
function isObject(x) {
    return typeof x === 'object' && !Array.isArray(x) && x !== null;
}
// 移除对象中的空值
function deepRemoveVoid(obj) {
    if (Array.isArray(obj)) {
        return obj.map(deepRemoveVoid);
    }
    else if (isObject(obj)) {
        let result = {};
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                if (typeof value !== 'undefined' && value !== null) {
                    result[key] = deepRemoveVoid(value);
                }
            }
        }
        return result;
    }
    else {
        return obj;
    }
}
function sha256(message, secret, encoding) {
    const hmac = crypto_1.default.createHmac('sha256', secret);
    return hmac.update(message).digest(encoding);
}
function getHash(message) {
    const hash = crypto_1.default.createHash('sha256');
    return hash.update(message).digest('hex');
}
function getDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const year = date.getUTCFullYear();
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    // UTC 日期，非本地时间
    const day = ('0' + date.getUTCDate()).slice(-2);
    return `${year}-${month}-${day}`;
}
class CloudService {
    /* eslint-disable-next-line */
    constructor(context, service, version, baseParams) {
        this.service = service;
        this.version = version;
        this.timeout = 60000;
        this.baseParams = baseParams || {};
        this.cloudBaseContext = context;
    }
    get baseUrl() {
        const tcb = process.env.TCB_BASE_URL || 'https://tcb.tencentcloudapi.com';
        const urlMap = {
            tcb,
            scf: 'https://scf.tencentcloudapi.com',
            vpc: 'https://vpc.tencentcloudapi.com',
            flexdb: 'https://flexdb.ap-shanghai.tencentcloudapi.com',
            cam: 'https://cam.tencentcloudapi.com',
            cdn: 'https://cdn.tencentcloudapi.com'
        };
        if (urlMap[this.service]) {
            return urlMap[this.service];
        }
        else {
            return `https://${this.service}.tencentcloudapi.com`;
        }
    }
    async request(action, data = {}, method = 'POST') {
        this.action = action;
        this.data = deepRemoveVoid(Object.assign(Object.assign({}, data), this.baseParams));
        this.method = method;
        this.url = this.baseUrl;
        let { secretId, secretKey, token } = this.cloudBaseContext;
        // 当在云函数环境下执行时，可init时不传入密钥，取环境变量中密钥使用
        // request执行时一般处于main函数内部，取环境变量逻辑写这里更可靠
        if (!secretId || !secretKey) {
            // 未主动传入密钥，从环境变量中读取
            const envSecretId = utils_1.getEnvVar(constant_1.ENV_NAME.ENV_SECRETID);
            const envSecretKey = utils_1.getEnvVar(constant_1.ENV_NAME.ENV_SECRETKEY);
            const envToken = utils_1.getEnvVar(constant_1.ENV_NAME.ENV_SESSIONTOKEN);
            if (!envSecretId || !envSecretKey) {
                if (utils_1.getRuntime() === constant_1.RUN_ENV.SCF) {
                    throw new Error('missing authoration key, redeploy the function');
                }
                else {
                    throw new Error('missing secretId or secretKey of tencent cloud');
                }
            }
            else {
                secretId = envSecretId;
                secretKey = envSecretKey;
                token = envToken;
            }
        }
        this.secretId = secretId;
        this.secretKey = secretKey;
        this.token = token;
        try {
            const data = await this.requestWithSign();
            if (data.Response.Error) {
                const tcError = new error_1.CloudBaseError(data.Response.Error.Message, {
                    requestId: data.Response.RequestId,
                    code: data.Response.Error.Code
                });
                throw tcError;
            }
            else {
                return data.Response;
            }
        }
        catch (e) {
            // throw e
            throw new error_1.CloudBaseError(e.message, {
                action,
                code: e.code
            });
        }
    }
    async requestWithSign() {
        // data 中可能带有 readStream，由于需要计算整个 body 的 hash，
        // 所以这里把 readStream 转为 Buffer
        // await convertReadStreamToBuffer(data)
        const timestamp = Math.floor(new Date().getTime() / 1000);
        const { proxy } = this.cloudBaseContext;
        const { method, timeout, data = {} } = this;
        if (method === 'GET') {
            this.url += '?' + query_string_1.default.stringify(data);
        }
        if (method === 'POST') {
            this.payload = data;
        }
        const config = {
            method,
            timeout,
            headers: {
                Host: new url_1.URL(this.url).host,
                'X-TC-Action': this.action,
                'X-TC-Region': process.env.TCB_REGION || 'ap-shanghai',
                'X-TC-Timestamp': timestamp,
                'X-TC-Version': this.version
            }
        };
        if (this.token) {
            config.headers['X-TC-Token'] = this.token;
        }
        if (method === 'GET') {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        if (method === 'POST') {
            config.body = JSON.stringify(data);
            config.headers['Content-Type'] = 'application/json';
        }
        const sign = this.getRequestSign(timestamp);
        config.headers['Authorization'] = sign;
        return http_request_1.fetch(this.url, config, proxy);
    }
    getRequestSign(timestamp) {
        const { method = 'POST', url, service, secretId, secretKey } = this;
        const urlObj = new url_1.URL(url);
        // 通用头部
        let headers = '';
        const signedHeaders = 'content-type;host';
        if (method === 'GET') {
            headers = 'content-type:application/x-www-form-urlencoded\n';
        }
        else if (method === 'POST') {
            headers = 'content-type:application/json\n';
        }
        headers += `host:${urlObj.hostname}\n`;
        const path = urlObj.pathname;
        const querystring = urlObj.search.slice(1);
        const payloadHash = this.payload ? getHash(JSON.stringify(this.payload)) : getHash('');
        const canonicalRequest = `${method}\n${path}\n${querystring}\n${headers}\n${signedHeaders}\n${payloadHash}`;
        const date = getDate(timestamp);
        const StringToSign = `TC3-HMAC-SHA256\n${timestamp}\n${date}/${service}/tc3_request\n${getHash(canonicalRequest)}`;
        const kDate = sha256(date, `TC3${secretKey}`);
        const kService = sha256(service, kDate);
        const kSigning = sha256('tc3_request', kService);
        const signature = sha256(StringToSign, kSigning, 'hex');
        return `TC3-HMAC-SHA256 Credential=${secretId}/${date}/${service}/tc3_request, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    }
}
exports.CloudService = CloudService;
