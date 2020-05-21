"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const node_fetch_1 = __importDefault(require("node-fetch"));
const https_proxy_agent_1 = __importDefault(require("https-proxy-agent"));
const error_1 = require("../error");
// 使用 fetch + 代理
async function fetch(url, config = {}, proxy) {
    if (proxy || process.env.http_proxy) {
        config.agent = new https_proxy_agent_1.default(proxy || process.env.http_proxy);
    }
    // 解决中文编码问题
    const escapeUrl = new url_1.URL(url).toString();
    let json;
    let text;
    try {
        const res = await node_fetch_1.default(escapeUrl, config);
        text = await res.text();
        json = JSON.parse(text);
    }
    catch (e) {
        // 某些情况下回返回 HTML 文本异常
        // JSON 解析错误，抛出原响应文本
        if (e.name === 'SyntaxError') {
            throw new error_1.CloudBaseError(text);
        }
        throw new error_1.CloudBaseError(e);
    }
    return json;
}
exports.fetch = fetch;
async function fetchStream(url, config = {}, proxy) {
    if (proxy || process.env.http_proxy) {
        config.agent = new https_proxy_agent_1.default(proxy || process.env.http_proxy);
    }
    // 解决中文编码问题
    const escapeUrl = new url_1.URL(url).toString();
    return node_fetch_1.default(escapeUrl, config);
}
exports.fetchStream = fetchStream;
