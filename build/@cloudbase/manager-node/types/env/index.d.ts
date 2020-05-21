import { Environment } from '../environment';
import { IResponseInfo, AuthDomain, EnvInfo, LoginConfigItem, ICheckTcbServiceRes, ICreatePostpayRes } from '../interfaces';
interface ICreateEnvParam {
    name: string;
    paymentMode?: PAYMENT_MODE;
    channel?: QCLOUD_CHANNEL;
}
declare type PAYMENT_MODE = 'prepay' | 'postpay';
declare type SOURCE = 'miniapp' | 'qcloud';
declare type QCLOUD_CHANNEL = 'cocos' | 'qq' | 'cloudgame' | 'qc_console' | 'dcloud';
interface IDeleteDomainRes {
    RequestId: string;
    Deleted: number;
}
interface IAuthDomainsRes {
    RequestId: string;
    Domains: AuthDomain[];
}
interface IListEnvRes {
    RequestId: string;
    EnvList: EnvInfo[];
}
interface IEnvLoginConfigRes {
    RequestId: string;
    ConfigList: LoginConfigItem[];
}
interface IInitParam {
    Channel?: string;
    Source?: string;
}
export declare class EnvService {
    private environment;
    private envId;
    private cloudService;
    private camService;
    private billService;
    constructor(environment: Environment);
    /**
     * 列出所有环境
     * @returns {Promise<IListEnvRes>}
     */
    listEnvs(): Promise<IListEnvRes>;
    /**
     * 创建新环境
     * @param {string} name 环境名称
     * @returns {Promise<ICreateEnvRes>}
     */
    createEnv(param: ICreateEnvParam): Promise<{
        envId: string;
    }>;
    /**
     * 拉取安全域名列表
     * @returns {Promise<IAuthDomainsRes>}
     */
    getEnvAuthDomains(): Promise<IAuthDomainsRes>;
    /**
     * 添加环境安全域名
     * @param {string[]} domains 域名字符串数组
     * @returns {Promise<IResponseInfo>}
     */
    createEnvDomain(domains: string[]): Promise<IResponseInfo>;
    /**
     * 删除环境安全域名
     * @param {string[]} domainIds 域名字符串数组
     * @returns {Promise<IDeleteDomainRes>}
     */
    deleteEnvDomain(domains: string[]): Promise<IDeleteDomainRes>;
    /**
     * 检查tcb服务是否开通
     * @returns {Promise<ICheckTcbServiceRes>}
     * @memberof CamService
     */
    checkTcbService(): Promise<ICheckTcbServiceRes>;
    /**
     * 初始化TCB
     * @returns {Promise<IResponseInfo>}
     * @memberof EnvService
     */
    initTcb(param: IInitParam): Promise<IResponseInfo>;
    /**
     * 开通后付费套餐
     * @param {string} envId
     * @param {SOURCE} [source]
     * @returns {Promise<ICreatePostpayRes>}
     * @memberof EnvService
     */
    CreatePostpayPackage(envId: string, source?: SOURCE): Promise<ICreatePostpayRes>;
    /**
     * 销毁环境
     * @param {string} envId
     * @returns {Promise<IResponseInfo>}
     * @memberof EnvService
     */
    destroyEnv(envId: string): Promise<IResponseInfo>;
    /**
     * 获取环境信息
     * @returns {Promise<IEnvInfoRes>}
     */
    getEnvInfo(): Promise<{
        EnvInfo: EnvInfo;
        RequestId: string;
    }>;
    /**
     * 修改环境名称
     * @param {string} alias 环境名称
     * @returns {Promise<IResponseInfo>}
     */
    updateEnvInfo(alias: string): Promise<IResponseInfo>;
    /**
     * 拉取登录配置列表
     * @returns {Promise<IEnvLoginConfigRes>}
     */
    getLoginConfigList(): Promise<IEnvLoginConfigRes>;
    /**
     * 创建登录方式
     * 'WECHAT-OPEN'：微信开放平台
     * 'WECHAT-PUBLIC'：微信公众平台
     * @param {('WECHAT-OPEN' | 'WECHAT-PUBLIC')} platform 'WECHAT-OPEN' | 'WECHAT-PUBLIC'
     * @param {string} appId 微信 appId
     * @param {string} appSecret 微信 appSecret
     * @returns {Promise<IResponseInfo>}
     */
    createLoginConfig(platform: 'WECHAT-OPEN' | 'WECHAT-PUBLIC' | 'QQ' | 'ANONYMOUS', appId: string, appSecret?: string): Promise<IResponseInfo>;
    /**
     * 更新登录方式配置
     * @param {string} configId 配置 Id，从配置列表中获取
     * @param {string} [status='ENABLE'] 是否启用 'ENABLE', 'DISABLE' ，可选
     * @param {string} [appId=''] 微信 appId，可选
     * @param {string} [appSecret=''] 微信 appSecret，可选
     * @returns {Promise<IResponseInfo>}
     */
    updateLoginConfig(configId: string, status?: string, appId?: string, appSecret?: string): Promise<IResponseInfo>;
    createCustomLoginKeys(): Promise<{
        PrivateKey: string;
        KeyID: string;
        RequestId: string;
    }>;
    private getCOSDomains;
    private modifyCosCorsDomain;
    private getCos;
    private getStorageConfig;
}
export {};
