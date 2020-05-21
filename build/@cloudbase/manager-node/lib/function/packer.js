"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const del_1 = __importDefault(require("del"));
const path_1 = __importDefault(require("path"));
const make_dir_1 = __importDefault(require("make-dir"));
const util_1 = __importDefault(require("util"));
const utils_1 = require("../utils");
const error_1 = require("../error");
// 10 MB
exports.BIG_FILE_SIZE = 10485760;
exports.API_MAX_SIZE = 52428800;
var CodeType;
(function (CodeType) {
    CodeType[CodeType["File"] = 0] = "File";
    CodeType[CodeType["JavaFile"] = 1] = "JavaFile";
})(CodeType = exports.CodeType || (exports.CodeType = {}));
const TEMPDIR_NAME = '.cloudbase_temp';
/**
 * 将函数代码转换成 Base64 编码
 * 普通文件：Node，PHP
 * Java 文件：Jar，ZIP
 */
class FunctionPacker {
    constructor(options) {
        const { root, name, codeType, ignore, incrementalPath, functionPath } = options;
        this.name = name;
        this.ignore = ignore;
        this.codeType = codeType;
        this.incrementalPath = incrementalPath;
        this.funcPath = functionPath ? functionPath : path_1.default.resolve(root, name);
        // 每个函数采用不同的文件夹
        this.tmpPath = root
            ? path_1.default.join(root, `${TEMPDIR_NAME}_${name}`)
            : path_1.default.join(process.cwd(), `${TEMPDIR_NAME}_${name}`);
    }
    async compressFiles() {
        utils_1.checkFullAccess(this.funcPath, true);
        // 清除原打包文件
        this.clean();
        // 确保目标路径存在
        await make_dir_1.default(this.tmpPath);
        // 生成 name.zip 文件
        this.zipFilePath = path_1.default.resolve(this.tmpPath, `${this.name}.zip`);
        const zipOption = {
            dirPath: this.funcPath,
            outputPath: this.zipFilePath,
            ignore: this.ignore
        };
        if (this.incrementalPath) {
            zipOption.pattern = this.incrementalPath;
        }
        await utils_1.compressToZip(zipOption);
    }
    // 获取 Java 代码
    getJavaFile() {
        const { funcPath } = this;
        // funcPath 可能以 .jar 或 .zip 结尾
        const filePath = funcPath.replace(/\.jar$|\.zip$/g, '');
        // Java 代码为 jar 或 zip 包
        const jarExist = utils_1.checkFullAccess(`${filePath}.jar`);
        const zipExist = utils_1.checkFullAccess(`${filePath}.zip`);
        if (!jarExist && !zipExist) {
            throw new error_1.CloudBaseError('未找到部署函数的 Jar 或者 ZIP 格式文件！');
        }
        this.zipFilePath = jarExist ? `${filePath}.jar` : `${filePath}.zip`;
    }
    async build() {
        if (this.codeType === CodeType.JavaFile) {
            try {
                await this.getJavaFile();
            }
            catch (e) {
                this.clean();
                throw new error_1.CloudBaseError(`函数代码打包失败：${e.message}`, {
                    code: e.code
                });
            }
        }
        if (this.codeType === CodeType.File) {
            try {
                await this.compressFiles();
            }
            catch (e) {
                this.clean();
                throw new error_1.CloudBaseError(`函数代码打包失败：${e.message}`, {
                    code: e.code
                });
            }
        }
    }
    // 函数压缩后的代码大于 10M，建议使用 COS 上传（当前暂不支持）
    async isBigFile() {
        if (!this.zipFilePath) {
            await this.build();
        }
        const promiseStat = util_1.default.promisify(fs_1.default.stat);
        const fileStats = await promiseStat(this.zipFilePath);
        return fileStats.size > exports.BIG_FILE_SIZE;
    }
    // API 最大 50MB
    async isReachMaxSize() {
        if (!this.zipFilePath) {
            await this.build();
        }
        const promiseStat = util_1.default.promisify(fs_1.default.stat);
        const fileStats = await promiseStat(this.zipFilePath);
        return fileStats.size > exports.API_MAX_SIZE;
    }
    async getBase64Code() {
        // 将 zip 文件转换成 base64
        const base64 = fs_1.default.readFileSync(this.zipFilePath).toString('base64');
        // 非 Java 函数清除打包文件
        if (this.codeType !== CodeType.JavaFile) {
            await this.clean();
        }
        return base64;
    }
    async clean() {
        // allow deleting the current working directory and outside
        this.tmpPath && del_1.default.sync([this.tmpPath], { force: true });
        return;
    }
}
exports.FunctionPacker = FunctionPacker;
