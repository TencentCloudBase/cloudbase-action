import { EnvService } from './env';
import { FunctionService } from './function';
import { StorageService } from './storage';
import { DatabaseService } from './database';
import { CommonService } from './common';
import { HostingService } from './hosting';
import { Environment } from './environment';
import { EnvironmentManager } from './environmentManager';
import { ThirdService } from './third';
interface CloudBaseConfig {
    secretId?: string;
    secretKey?: string;
    token?: string;
    envId?: string;
    proxy?: string;
}
declare class CloudBase {
    private static cloudBase;
    /**
     * init 初始化 为单例
     *
     * @static
     * @param {ManagerConfig} config
     * @returns {CloudBase}
     * @memberof CloudBase
     */
    static init(config: CloudBaseConfig): CloudBase;
    private context;
    private cloudBaseConfig;
    private environmentManager;
    constructor(config?: CloudBaseConfig);
    addEnvironment(envId: string): void;
    currentEnvironment(): Environment;
    get functions(): FunctionService;
    get storage(): StorageService;
    get database(): DatabaseService;
    get hosting(): HostingService;
    commonService(service?: string, version?: string): CommonService;
    get env(): EnvService;
    get third(): ThirdService;
    getEnvironmentManager(): EnvironmentManager;
    getManagerConfig(): CloudBaseConfig;
}
export = CloudBase;
