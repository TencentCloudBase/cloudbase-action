import path from 'path'
import { CloudBaseError } from '../error'
import { Environment } from '../environment'
import { CloudService, preLazy, checkReadable, isDirectory } from '../utils'
import { IListFileInfo } from '../interfaces'

export interface IProgressData {
    loaded: number // 已经上传的部分 字节
    total: number // 整个文件的大小 字节
    speed: number // 文件上传速度 字节/秒
    percent: number // 百分比 小数 0 - 1
}

export type OnProgress = (progressData: IProgressData) => void
export type OnFileFinish = (error: Error, res: any, fileData: any) => void

export interface IHostingFileOptions {
    localPath: string
    cloudPath?: string
    // 上传文件并发数量
    parallel?: number
    files?: {
        localPath: string
        cloudPath: string
    }[]
    onProgress?: OnProgress
    onFileFinish?: OnFileFinish
    ignore?: string | string[]
}

export interface IHostingFilesOptions {
    // 上传文件并发数量
    localPath?: string
    cloudPath?: string
    parallel?: number
    files: {
        localPath: string
        cloudPath: string
    }[]
    onProgress?: OnProgress
    onFileFinish?: OnFileFinish
    ignore?: string | string[]
}

export type IHostingOptions = IHostingFileOptions | IHostingFilesOptions

export interface IHostingCloudOptions {
    cloudPath: string
    isDir: boolean
}

export interface IBindDomainOptions {
    domain: string
    certId: string
}

export interface ICheckSourceOptions {
    domains: string[]
}

export interface ITcbOrigin {
    Master: string // 主站
    Slave: string // 副站
}

export interface IIpFilter {
    Switch: string // IP 黑白名单配置开关
    FilterType?: string // IP 黑白名单类型
    Filters?: string[] // IP 黑白名单列表
}

export interface IIpFreqLimit {
    Switch: string // IP 限频配置开关
    Qps?: number // 设置每秒请求数限制
}

export interface ITcbAuthentication {
    Switch: string // on/off 开启或关闭
    SecretKey: string // 用户计算签名的秘钥
    SignParam?: string // url串中签名的字段名
    TimeParam?: string // url串中时间的字段名
    ExpireTime?: string // 开启时必填过期时间
}

export interface ITcbCache {
    RuleType: string // 规则类型
    RuleValue: string // 规则内容
    CacheTtl: number // 缓存时间
}

export interface ITcbRefererRule {
    RefererType: string // referer 配置类型
    Referers: string[] // referer 内容列表列表
    AllowEmpty: boolean // 是否允许空 referer
}

export interface ITcbReferer {
    Switch: string // 黑白名单配置开关
    RefererRules?: ITcbRefererRule[]
}

export interface ITcbDomainConfig {
    // Origin?: ITcbOrigin // 源域名
    // CosPrivateAccess?: string //是否开始cos私有读
    // Authentication?: ITcbAuthentication // 防盗链设置
    Cache?: ITcbCache[] // 缓存策略
    IpFilter?: IIpFilter // IP 黑白名单配置
    IpFreqLimit?: IIpFreqLimit // IP 限频配置
    Refer?: ITcbReferer
}

export interface IModifyOptions {
    domain: string // 域名
    domainId: number // 域名ID
    domainConfig: ITcbDomainConfig // 域名配置
}

export interface IDeleteDomainOptions {
    domain: string
}

const HostingStatusMap = {
    init: '初始化中',
    process: '处理中',
    online: '上线',
    destroying: '销毁中',
    offline: '下线',
    create_fail: '初始化失败', // eslint-disable-line
    destroy_fail: '销毁失败' // eslint-disable-line
}

export interface IHostingInfo {
    EnvId: string
    CdnDomain: string
    Bucket: string
    Regoin: string
    Status: string
    MaxDomain: number
    Id: number
    PolicyId: number
}

export interface IRoutingRules {
    keyPrefixEquals?: string // 前缀匹配
    httpErrorCodeReturnedEquals?: string // 错误码
    replaceKeyWith?: string // 替换内容
    replaceKeyPrefixWith?: string // condition设置为KeyPrefixEquals 前缀匹配时可设置
}

export interface IBucketWebsiteOptiosn {
    indexDocument: string
    errorDocument?: string
    routingRules?: Array<IRoutingRules>
}

export interface IFindOptions {
    prefix?: string
    marker?: string
    maxKeys?: number
}

export class HostingService {
    private environment: Environment
    private tcbService: CloudService
    private cdnService: CloudService

    constructor(environment: Environment) {
        this.environment = environment
        this.tcbService = new CloudService(environment.cloudBaseContext, 'tcb', '2018-06-08')
        this.cdnService = new CloudService(environment.cloudBaseContext, 'cdn', '2018-06-06')
    }

    /**
     * 获取 hosting 信息
     */
    @preLazy()
    async getInfo(): Promise<IHostingInfo[]> {
        const { envId } = this.getHostingConfig()
        const { Data } = await this.tcbService.request('DescribeStaticStore', {
            EnvId: envId
        })

        return Data
    }

    /**
     * 开启 hosting 服务，异步任务
     */
    @preLazy()
    async enableService() {
        const { envId } = this.getHostingConfig()

        const hostings = await this.getInfo()
        // hosting 服务已开启
        if (hostings?.length) {
            const website = hostings[0]
            // offline 状态的服务可重新开启
            if (website.Status !== 'offline') {
                throw new CloudBaseError('静态网站服务已开启，请勿重复操作！')
            }
        }

        const res = await this.tcbService.request('CreateStaticStore', {
            EnvId: envId
        })

        const code = res.Result === 'succ' ? 0 : -1

        return {
            code,
            requestId: res.RequestId
        }
    }

    async findFiles(options: IFindOptions): Promise<any> {
        const hosting = await this.checkStatus()
        const { Bucket, Regoin } = hosting
        const { maxKeys, marker, prefix } = options

        const storageService = await this.environment.getStorageService()
        const res = await storageService.getBucket({
            bucket: Bucket,
            region: Regoin,
            maxKeys,
            marker,
            prefix
        })
        return res
    }

    /**
     * 展示文件列表
     */
    @preLazy()
    async listFiles(): Promise<IListFileInfo[]> {
        const hosting = await this.checkStatus()
        const { Bucket, Regoin } = hosting
        const storageService = await this.environment.getStorageService()

        const list = await storageService.walkCloudDirCustom({
            prefix: '',
            bucket: Bucket,
            region: Regoin
        })

        return list
    }

    /**
     * 销毁静态托管服务
     */
    @preLazy()
    async destroyService() {
        const { envId } = this.getHostingConfig()

        const files = await this.listFiles()

        if (files?.length) {
            throw new CloudBaseError('静态网站文件不为空，无法销毁！', {
                code: 'INVALID_OPERATION'
            })
        }

        const hostings = await this.getInfo()

        if (!hostings || !hostings.length) {
            throw new CloudBaseError('静态网站服务未开启！', {
                code: 'INVALID_OPERATION'
            })
        }

        const website = hostings[0]

        // destroy_fail 状态可重试
        if (website.Status !== 'online' && website.Status !== 'destroy_fail') {
            throw new CloudBaseError(
                `静态网站服务【${HostingStatusMap[website.Status]}】，无法进行此操作！`,
                {
                    code: 'INVALID_OPERATION'
                }
            )
        }

        const res = await this.tcbService.request('DestroyStaticStore', {
            EnvId: envId
        })

        const code = res.Result === 'succ' ? 0 : -1
        return {
            code,
            requestId: res.RequestId
        }
    }

    /**
     * 支持上传单个文件，文件夹，或多个文件
     * @param options
     */
    @preLazy()
    async uploadFiles(options: IHostingOptions) {
        const {
            localPath,
            cloudPath,
            files = [],
            onProgress,
            onFileFinish,
            parallel = 20,
            ignore
        } = options

        const hosting = await this.checkStatus()
        const { Bucket, Regoin } = hosting
        const storageService = await this.environment.getStorageService()

        let uploadFiles = Array.isArray(files) ? files : []

        // localPath 存在，上传文件夹/文件
        if (localPath) {
            const resolvePath = path.resolve(localPath)
            // 检查路径是否存在
            checkReadable(resolvePath, true)

            if (isDirectory(resolvePath)) {
                return storageService.uploadDirectoryCustom({
                    localPath: resolvePath,
                    cloudPath,
                    bucket: Bucket,
                    region: Regoin,
                    onProgress,
                    onFileFinish,
                    fileId: false,
                    ignore
                })
            } else {
                // 文件上传统一通过批量上传接口
                const assignCloudPath = cloudPath || path.parse(resolvePath).base
                uploadFiles.push({
                    localPath: resolvePath,
                    cloudPath: assignCloudPath
                })
            }
        }

        // 文件上传统一通过批量上传接口
        return storageService.uploadFilesCustom({
            ignore,
            parallel,
            onProgress,
            onFileFinish,
            bucket: Bucket,
            region: Regoin,
            files: uploadFiles,
            fileId: false
        })
    }

    /**
     * 删除文件或文件夹
     * @param options
     */
    @preLazy()
    async deleteFiles(options: IHostingCloudOptions) {
        const { cloudPath, isDir } = options
        const hosting = await this.checkStatus()
        const { Bucket, Regoin } = hosting
        const storageService = await this.environment.getStorageService()

        if (isDir) {
            return storageService.deleteDirectoryCustom({
                cloudPath,
                bucket: Bucket,
                region: Regoin
            })
        } else {
            try {
                await storageService.deleteFileCustom([cloudPath], Bucket, Regoin)
                return {
                    Deleted: [{ Key: cloudPath }],
                    Error: []
                }
            } catch (e) {
                return {
                    Deleted: [],
                    Error: [e]
                }
            }
        }
    }

    // 遍历文件
    @preLazy()
    async walkLocalDir(envId: string, dir: string) {
        const storageService = await this.environment.getStorageService()
        return storageService.walkLocalDir(dir)
    }

    /**
     * 绑定自定义域名
     * @param {IBindDomainOptions} options
     * @returns
     * @memberof HostingService
     */
    @preLazy()
    async CreateHostingDomain(options: IBindDomainOptions) {
        const { envId } = this.getHostingConfig()
        const { certId, domain } = options
        const res = await this.tcbService.request('CreateHostingDomain', {
            EnvId: envId,
            Domain: domain,
            CertId: certId
        })

        return res
    }

    /**
     * 删除托管域名
     *
     * @param {IBindDomainOptions} options
     * @returns
     * @memberof HostingService
     */
    @preLazy()
    async deleteHostingDomain(options: IDeleteDomainOptions) {
        const { envId } = this.getHostingConfig()
        const { domain } = options
        const res = await this.tcbService.request('DeleteHostingDomain', {
            EnvId: envId,
            Domain: domain
        })
        return res
    }

    /**
     * 查询域名状态信息
     * @param options
     */
    async tcbCheckResource(options: ICheckSourceOptions) {
        return this.cdnService.request('TcbCheckResource', {
            Domains: options.domains
        })
    }

    /**
     * 域名配置变更
     * @param options
     */
    async tcbModifyAttribute(options: IModifyOptions) {
        const { domain, domainId, domainConfig } = options

        const res = await this.cdnService.request('TcbModifyAttribute', {
            Domain: domain,
            DomainId: domainId,
            DomainConfig: domainConfig
        })
        return res
    }

    /**
     * 查询静态网站配置
     * @memberof HostingService
     */
    async getWebsiteConfig() {
        const hosting = await this.checkStatus()
        const { Bucket, Regoin } = hosting
        const storageService = await this.environment.getStorageService()
        const res = await storageService.getWebsiteConfig({ bucket: Bucket, region: Regoin })
        return res
    }

    /**
     * 配置静态网站文档
     * @param options
     */
    async setWebsiteDocument(options: IBucketWebsiteOptiosn) {
        const { indexDocument, errorDocument, routingRules } = options
        const hosting = await this.checkStatus()
        const { Bucket, Regoin } = hosting

        const storageService = await this.environment.getStorageService()
        const res = await storageService.putBucketWebsite({
            bucket: Bucket,
            region: Regoin,
            indexDocument,
            errorDocument,
            routingRules
        })
        return res
    }

    /**
     * 检查 hosting 服务状态
     */
    @preLazy()
    private async checkStatus() {
        const hostings = await this.getInfo()

        if (!hostings || !hostings.length) {
            throw new CloudBaseError(
                `您还没有开启静态网站服务，请先到云开发控制台开启静态网站服务！`,
                {
                    code: 'INVALID_OPERATION'
                }
            )
        }

        const website = hostings[0]

        if (website.Status !== 'online') {
            throw new CloudBaseError(
                `静态网站服务【${HostingStatusMap[website.Status]}】，无法进行此操作！`,
                {
                    code: 'INVALID_OPERATION'
                }
            )
        }

        return website
    }

    /**
     * 获取配置
     */
    private getHostingConfig() {
        const envConfig = this.environment.lazyEnvironmentConfig
        const appId = envConfig.Storages[0]?.AppId
        const { proxy } = this.environment.cloudBaseContext

        return {
            appId,
            proxy,
            envId: envConfig.EnvId
        }
    }
}
