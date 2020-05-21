"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const archiver_1 = __importDefault(require("archiver"));
const crypto_1 = __importDefault(require("crypto"));
const constant_1 = require("../constant");
var uuid_1 = require("./uuid");
exports.guid6 = uuid_1.guid6;
__export(require("./cloud-api-request"));
__export(require("./auth"));
__export(require("./cloudbase-request"));
__export(require("./http-request"));
__export(require("./envLazy"));
__export(require("./fs"));
async function compressToZip(option) {
    const { dirPath, outputPath, ignore, pattern = '**/*' } = option;
    return new Promise((resolve, reject) => {
        const output = fs_1.default.createWriteStream(outputPath);
        const archive = archiver_1.default('zip');
        output.on('close', function () {
            resolve({
                zipPath: outputPath,
                size: Math.ceil(archive.pointer() / 1024)
            });
        });
        archive.on('error', function (err) {
            reject(err);
        });
        archive.pipe(output);
        // append files from a glob pattern
        archive.glob(pattern, {
            // 目标路径
            cwd: dirPath,
            ignore: ignore,
            dot: true
        });
        archive.finalize();
    });
}
exports.compressToZip = compressToZip;
function getRuntime() {
    return process.env[constant_1.ENV_NAME.ENV_RUNENV];
}
exports.getRuntime = getRuntime;
function getEnvVar(envName) {
    return process.env[envName];
}
exports.getEnvVar = getEnvVar;
function rsaEncrypt(data) {
    const buffer = Buffer.from(data);
    const encrypted = crypto_1.default.publicEncrypt({
        key: constant_1.PUBLIC_RSA_KEY,
        padding: crypto_1.default.constants.RSA_PKCS1_PADDING
    }, buffer);
    return encrypted.toString('base64');
}
exports.rsaEncrypt = rsaEncrypt;
function sleep(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}
exports.sleep = sleep;
