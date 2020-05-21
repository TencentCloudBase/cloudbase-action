"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const function_1 = require("./function");
const storage_1 = require("./storage");
const env_1 = require("./env");
const common_1 = require("./common");
const error_1 = require("./error");
const constant_1 = require("./constant");
const utils_1 = require("./utils");
const hosting_1 = require("./hosting");
const third_1 = require("./third");
class Environment {
    constructor(context, envId) {
        this.inited = false;
        this.envId = envId;
        this.cloudBaseContext = context;
        // 拉取当前环境 的环境信息 todo
        this.functionService = new function_1.FunctionService(this);
        this.databaseService = new database_1.DatabaseService(this);
        this.storageService = new storage_1.StorageService(this);
        this.envService = new env_1.EnvService(this);
        this.hostingService = new hosting_1.HostingService(this);
        this.thirdService = new third_1.ThirdService(this);
    }
    async lazyInit() {
        if (!this.inited) {
            const envConfig = this.envService;
            return envConfig.getEnvInfo().then((envInfo) => {
                this.lazyEnvironmentConfig = envInfo.EnvInfo;
                if (!this.lazyEnvironmentConfig.EnvId) {
                    throw new error_1.CloudBaseError(`Environment ${this.envId} not found`);
                }
                this.inited = true;
                return this.lazyEnvironmentConfig;
            });
        }
        else {
            return this.lazyEnvironmentConfig;
        }
    }
    getEnvId() {
        return this.envId;
    }
    getStorageService() {
        return this.storageService;
    }
    getDatabaseService() {
        return this.databaseService;
    }
    getFunctionService() {
        return this.functionService;
    }
    getEnvService() {
        return this.envService;
    }
    getHostingService() {
        return this.hostingService;
    }
    getThirdService() {
        return this.thirdService;
    }
    getCommonService(serviceType = 'tcb', serviceVersion) {
        return new common_1.CommonService(this, serviceType, serviceVersion);
    }
    getServicesEnvInfo() {
        const envConfig = this.envService;
        return envConfig.getEnvInfo().then((envInfo) => {
            return envInfo.EnvInfo;
        });
    }
    getAuthConfig() {
        let { secretId, secretKey, token, proxy } = this.cloudBaseContext;
        const envId = this.getEnvId();
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
        return {
            envId,
            secretId,
            secretKey,
            token,
            proxy
        };
    }
}
exports.Environment = Environment;
