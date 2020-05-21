"use strict";
const context_1 = require("./context");
const environmentManager_1 = require("./environmentManager");
class CloudBase {
    constructor(config = {}) {
        this.cloudBaseConfig = {};
        let { secretId, secretKey, token, envId, proxy } = config;
        // config 中传入的 secretid secretkey 必须同时存在
        if ((secretId && !secretKey) || (!secretId && secretKey)) {
            throw new Error('secretId and secretKey must be a pair');
        }
        this.cloudBaseConfig = {
            secretId,
            secretKey,
            token,
            envId,
            proxy
        };
        // 初始化 context
        this.context = new context_1.CloudBaseContext(this.cloudBaseConfig);
        this.environmentManager = new environmentManager_1.EnvironmentManager(this.context);
        this.environmentManager.add(envId || '');
    }
    /**
     * init 初始化 为单例
     *
     * @static
     * @param {ManagerConfig} config
     * @returns {CloudBase}
     * @memberof CloudBase
     */
    static init(config) {
        if (!CloudBase.cloudBase) {
            CloudBase.cloudBase = new CloudBase(config);
        }
        return CloudBase.cloudBase;
    }
    addEnvironment(envId) {
        this.environmentManager.add(envId);
    }
    currentEnvironment() {
        return this.environmentManager.getCurrentEnv();
    }
    get functions() {
        return this.currentEnvironment().getFunctionService();
    }
    get storage() {
        return this.currentEnvironment().getStorageService();
    }
    get database() {
        return this.currentEnvironment().getDatabaseService();
    }
    get hosting() {
        return this.currentEnvironment().getHostingService();
    }
    commonService(service, version) {
        return this.currentEnvironment().getCommonService(service, version);
    }
    get env() {
        return this.currentEnvironment().getEnvService();
    }
    get third() {
        return this.currentEnvironment().getThirdService();
    }
    getEnvironmentManager() {
        return this.environmentManager;
    }
    getManagerConfig() {
        return this.cloudBaseConfig;
    }
}
module.exports = CloudBase;
