import path from 'path'
import {
    IServiceVersion,
    IExistsRes,
    CreateIndex,
    DropIndex,
    IndexInfo,
    TableInfo,
    Pager,
    IResponseInfo,
    CollectionDispension
} from '../interfaces/'
import { CloudBaseError } from '../error'
import { Environment } from '../environment'
import { CloudService } from '../utils'

interface IDatabaseConfig {
    Tag: string
}

interface IIndexiesInfo {
    CreateIndexes?: Array<CreateIndex>
    DropIndexes?: Array<DropIndex>
}

interface ITableInfo extends IResponseInfo {
    Indexes?: Array<IndexInfo>
    IndexNum?: number
}

interface IMgoQueryInfo {
    MgoLimit?: number
    MgoOffset?: number
}

interface ICollectionInfo extends IResponseInfo {
    Collections: Array<TableInfo>
    Pager: Pager
}

interface ICollectionExistInfo extends IResponseInfo {
    IsCreated: boolean
    ExistsResult: IExistsRes
}

interface IDistributionInfo extends IResponseInfo {
    Collections: CollectionDispension
    Count: number
    Total: number
}

interface IDatabaseMigrateQueryInfo extends IResponseInfo {
    Status: string
    RecordSuccess: number
    RecordFail: number
    ErrorMsg: string
    FileUrl: string
}

interface IDatabaseImportAndExportInfo extends IResponseInfo {
    JobId: number
}

function preLazy() {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let oldFunc = descriptor.value
        descriptor.value = async function() {
            // 检查当前环境对象上是否已加载好环境信息
            const currentEnvironment = this.environment

            if (!currentEnvironment.inited) {
                await currentEnvironment.lazyInit()
            }
            let result = await oldFunc.apply(this, arguments)
            return result
        }
    }
}

export class DatabaseService {
    static tcbServiceVersion: IServiceVersion = {
        service: 'tcb',
        version: '2018-06-08'
    }

    static flexdbServiceVersion: IServiceVersion = {
        service: 'flexdb',
        version: '2018-11-27'
    }

    private environment: Environment
    private envId: string
    private dbOpService: CloudService
    private collOpService: CloudService
    private DEFAULT_MGO_OFFSET = 0
    private DEFAULT_MGO_LIMIT = 100

    constructor(environment: Environment) {
        this.environment = environment
        this.envId = environment.getEnvId()

        this.dbOpService = new CloudService(
            environment.cloudBaseContext,
            DatabaseService.tcbServiceVersion.service,
            DatabaseService.tcbServiceVersion.version
        )

        this.collOpService = new CloudService(
            environment.cloudBaseContext,
            DatabaseService.flexdbServiceVersion.service,
            DatabaseService.flexdbServiceVersion.version
        )
    }

    public getCurrEnvironment(): Environment {
        return this.environment
    }

    public getDatabaseConfig(): IDatabaseConfig {
        const currEnv = this.environment
        const { Databases } = currEnv.lazyEnvironmentConfig
        return {
            Tag: Databases[0].InstanceId
        }
    }

    public async checkCollectionExists(collectionName: string): Promise<IExistsRes> {
        try {
            const result = await this.describeCollection(collectionName)

            return {
                RequestId: result.RequestId,
                Exists: true
            }
        } catch (e) {
            return {
                RequestId: e.requestId,
                Msg: e.message,
                Exists: false
            }
        }
    }

    @preLazy()
    public async createCollection(collectionName: string): Promise<any> {
        let { Tag } = this.getDatabaseConfig()

        const res = await this.collOpService.request('CreateTable', {
            Tag,
            TableName: collectionName
        })
        return res
    }

    @preLazy()
    public async deleteCollection(collectionName: string): Promise<any> {
        // 先检查当前集合是否存在
        const existRes = await this.checkCollectionExists(collectionName)
        if (existRes.Exists) {
            let { Tag } = this.getDatabaseConfig()

            const res = await this.collOpService.request('DeleteTable', {
                Tag,
                TableName: collectionName
            })
            return res
        } else {
            return existRes
        }
    }

    @preLazy()
    public async updateCollection(
        collectionName: string,
        indexiesInfo: IIndexiesInfo
    ): Promise<any> {
        let { Tag } = this.getDatabaseConfig()

        const res = await this.collOpService.request('UpdateTable', {
            Tag,
            TableName: collectionName,
            ...indexiesInfo
        })
        return res
    }

    @preLazy()
    public async describeCollection(collectionName: string): Promise<ITableInfo> {
        let { Tag } = this.getDatabaseConfig()

        const res = await this.collOpService.request('DescribeTable', {
            Tag,
            TableName: collectionName
        })
        return res
    }

    @preLazy()
    public async listCollections(
        options: IMgoQueryInfo = {
            MgoLimit: this.DEFAULT_MGO_LIMIT,
            MgoOffset: this.DEFAULT_MGO_OFFSET
        }
    ): Promise<ICollectionInfo> {
        let { Tag } = this.getDatabaseConfig()

        if (options.MgoLimit === undefined) {
            options.MgoLimit = this.DEFAULT_MGO_LIMIT
        }

        if (options.MgoOffset === undefined) {
            options.MgoOffset = this.DEFAULT_MGO_OFFSET
        }

        const res = await this.collOpService.request('ListTables', {
            Tag,
            ...options
        })

        if (res.Tables === null) {
            // 无集合
            res.Collections = []
        } else {
            // 云api返回转换为与TCB一致
            res.Collections = res.Tables.map(item => {
                item.CollectionName = item.TableName
                delete item.TableName
                return item
            })
        }

        delete res.Tables
        return res
    }

    public async createCollectionIfNotExists(
        collectionName: string
    ): Promise<ICollectionExistInfo> {
        const existRes = await this.checkCollectionExists(collectionName)
        let res
        if (!existRes.Exists) {
            res = await this.createCollection(collectionName)
            return {
                RequestId: res.RequestId,
                IsCreated: true,
                ExistsResult: existRes
            }
        } else {
            return {
                RequestId: '',
                IsCreated: false,
                ExistsResult: existRes
            }
        }
    }

    // 检查集合中是否存在某索引
    public async checkIndexExists(collectionName: string, indexName: string): Promise<IExistsRes> {
        const result = await this.describeCollection(collectionName)
        let exists = result.Indexes.some(item => {
            return item.Name === indexName
        })

        return {
            RequestId: result.RequestId,
            Exists: exists
        }
    }

    // 查询DB的数据存储分布
    public async distribution(): Promise<IDistributionInfo> {
        const res: any = await this.dbOpService.request('DescribeDbDistribution', {
            EnvId: this.envId
        })

        return res
    }

    // 查询DB 迁移进度
    public async migrateStatus(jobId: number): Promise<IDatabaseMigrateQueryInfo> {
        const res: IDatabaseMigrateQueryInfo = await this.dbOpService.request(
            'DatabaseMigrateQueryInfo',
            {
                EnvId: this.envId,
                JobId: jobId
            }
        )

        return res
    }

    // 数据库导入数据
    public async import(
        collectionName: string,
        file: any,
        options: any
    ): Promise<IDatabaseImportAndExportInfo> {
        let filePath
        let fileType
        if (file['FilePath']) {
            let temp = 'tmp/db-imports/'
            if (options['ObjectKeyPrefix']) {
                temp = options['ObjectKeyPrefix']
                delete options['ObjectKeyPrefix']
            }
            filePath = path.join(temp, path.basename(file['FilePath']))

            // 调用cos接口 上传文件  todo
            await this.environment.getStorageService().uploadFile({
                localPath: file['FilePath'],
                cloudPath: filePath
            })

            fileType = path.extname(filePath).substring(1)
        } else if (file['ObjectKey']) {
            delete options['ObjectKeyPrefix']
            filePath = file['ObjectKey']
            fileType = path.extname(filePath).substring(1)
        } else {
            throw new CloudBaseError('Miss file.filePath or file.objectKey')
        }

        if (file['FileType']) {
            fileType = file['FileType']
        }

        return this.dbOpService.request('DatabaseMigrateImport', {
            CollectionName: collectionName,
            FilePath: filePath,
            FileType: fileType,
            EnvId: this.envId,
            ...options
        })
    }

    // 数据库导出数据
    public async export(
        collectionName: string,
        file: any,
        options: any
    ): Promise<IDatabaseImportAndExportInfo> {
        let filePath
        let fileType

        if (file['ObjectKey']) {
            filePath = file['ObjectKey']
            fileType = path.extname(filePath).substring(1)
        } else {
            throw new CloudBaseError('Miss file.filePath or file.objectKey')
        }

        if (file['FileType']) {
            fileType = file['FileType']
        }

        return this.dbOpService.request('DatabaseMigrateExport', {
            CollectionName: collectionName,
            FilePath: filePath,
            FileType: fileType,
            EnvId: this.envId,
            ...options
        })
    }
}
