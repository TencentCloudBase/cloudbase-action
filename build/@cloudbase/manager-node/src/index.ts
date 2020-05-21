import { EnvService } from './env'
import { FunctionService } from './function'
import { StorageService } from './storage'
import { DatabaseService } from './database'
import { CloudBaseContext } from './context'
import { CommonService } from './common'
import { HostingService } from './hosting'
import { Environment } from './environment'
import { EnvironmentManager } from './environmentManager'
import { ThirdService } from './third'

interface CloudBaseConfig {
    secretId?: string
    secretKey?: string
    token?: string
    envId?: string
    proxy?: string
}

class CloudBase {
    private static cloudBase: CloudBase

    /**
     * init 初始化 为单例
     *
     * @static
     * @param {ManagerConfig} config
     * @returns {CloudBase}
     * @memberof CloudBase
     */
    public static init(config: CloudBaseConfig): CloudBase {
        if (!CloudBase.cloudBase) {
            CloudBase.cloudBase = new CloudBase(config)
        }

        return CloudBase.cloudBase
    }

    private context: CloudBaseContext
    private cloudBaseConfig: CloudBaseConfig = {}
    private environmentManager: EnvironmentManager

    public constructor(config: CloudBaseConfig = {}) {
        let { secretId, secretKey, token, envId, proxy } = config
        // config 中传入的 secretid secretkey 必须同时存在
        if ((secretId && !secretKey) || (!secretId && secretKey)) {
            throw new Error('secretId and secretKey must be a pair')
        }

        this.cloudBaseConfig = {
            secretId,
            secretKey,
            token,
            envId,
            proxy
        }

        // 初始化 context
        this.context = new CloudBaseContext(this.cloudBaseConfig)

        this.environmentManager = new EnvironmentManager(this.context)
        this.environmentManager.add(envId || '')
    }

    public addEnvironment(envId: string): void {
        this.environmentManager.add(envId)
    }

    public currentEnvironment(): Environment {
        return this.environmentManager.getCurrentEnv()
    }

    public get functions(): FunctionService {
        return this.currentEnvironment().getFunctionService()
    }
    public get storage(): StorageService {
        return this.currentEnvironment().getStorageService()
    }
    public get database(): DatabaseService {
        return this.currentEnvironment().getDatabaseService()
    }

    public get hosting(): HostingService {
        return this.currentEnvironment().getHostingService()
    }

    public commonService(service?: string, version?: string): CommonService {
        return this.currentEnvironment().getCommonService(service, version)
    }

    public get env(): EnvService {
        return this.currentEnvironment().getEnvService()
    }

    public get third(): ThirdService {
        return this.currentEnvironment().getThirdService()
    }

    public getEnvironmentManager(): EnvironmentManager {
        return this.environmentManager
    }

    public getManagerConfig(): CloudBaseConfig {
        return this.cloudBaseConfig
    }
}

export = CloudBase
