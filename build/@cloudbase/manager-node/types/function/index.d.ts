import { Environment } from '../environment';
import { IResponseInfo, ICloudFunction, IFunctionLogOptions, ICloudFunctionTrigger, IFunctionInvokeRes, IFunctionLogRes, IFunctionDownloadUrlRes } from '../interfaces';
export interface IFunctionCode {
    func: ICloudFunction;
    functionRootPath?: string;
    base64Code?: string;
    functionPath?: string;
}
export interface ICreateFunctionParam {
    func: ICloudFunction;
    functionRootPath?: string;
    force?: boolean;
    base64Code?: string;
    functionPath?: string;
    codeSecret?: string;
}
export interface IUpdateFunctionCodeParam {
    func: ICloudFunction;
    functionPath?: string;
    functionRootPath?: string;
    base64Code?: string;
    codeSecret?: string;
}
export interface IUpdateFunctionIncrementalCodeParam {
    func: ICloudFunction;
    functionRootPath: string;
    deleteFiles?: Array<string>;
    addFiles?: string;
}
export interface ICreateFunctionRes {
    triggerRes: IResponseInfo;
    configRes: IResponseInfo;
    codeRes: IResponseInfo;
}
export interface IFunctionLayerOptions {
    contentPath?: string;
    base64Content?: string;
    name: string;
    runtimes: string[];
    description?: string;
    licenseInfo?: string;
}
export interface ICreateLayerResponse extends IResponseInfo {
    LayerVersion: number;
}
export interface ILayerOptions {
    name: string;
    version: number;
}
export interface IVersionListOptions {
    name: string;
    runtimes?: string[];
}
export interface ILayerListOptions {
    offset?: number;
    limit?: number;
    runtime?: string;
    searchKey?: string;
}
export interface ILayerVersionInfo {
    CompatibleRuntimes: string[];
    AddTime: string;
    Description: string;
    LicenseInfo: string;
    LayerVersion: number;
    LayerName: string;
    Status: string;
}
export interface IListLayerVersionsRes extends IResponseInfo {
    LayerVersions: Array<ILayerVersionInfo>;
}
export interface IListLayerRes extends IResponseInfo {
    Layers: Array<ILayerVersionInfo>;
    TotalCount: number;
}
export interface IGetLayerVersionRes extends IResponseInfo {
    CompatibleRuntimes: string[];
    CodeSha256: string;
    Location: string;
    AddTime: string;
    Description: string;
    LicenseInfo: string;
    LayerVersion: number;
    LayerName: string;
    Status: string;
}
export declare class FunctionService {
    private environment;
    private vpcService;
    private scfService;
    constructor(environment: Environment);
    /**
     * 增量更新函数代码
     * @param {IUpdateFunctionIncrementalCodeParam} funcParam
     * @returns {Promise<void>}
     * @memberof FunctionService
     */
    updateFunctionIncrementalCode(funcParam: IUpdateFunctionIncrementalCodeParam): Promise<IResponseInfo>;
    /**
     * 创建云函数
     * @param {ICreateFunctionParam} funcParam
     * @returns {(Promise<IResponseInfo | ICreateFunctionRes>)}
     */
    createFunction(funcParam: ICreateFunctionParam): Promise<IResponseInfo | ICreateFunctionRes>;
    /**
     * 列出函数
     * @param {number} [limit=20]
     * @param {number} [offset=0]
     * @returns {Promise<Record<string, string>[]>}
     */
    listFunctions(limit?: number, offset?: number): Promise<Record<string, string>[]>;
    /**
     * 删除云函数
     * @param {string} name 云函数名称
     * @returns {Promise<IResponseInfo>}
     */
    deleteFunction(name: string): Promise<IResponseInfo>;
    /**
     * 获取云函数详细信息
     * @param {string} name 云函数名称
     * @returns {Promise<Record<string, string>>}
     */
    getFunctionDetail(name: string, codeSecret?: string): Promise<Record<string, string>>;
    /**
     * 获取函数日志
     * @param {{
     *         name: string
     *         offset: number
     *         limit: number
     *         order: string
     *         orderBy: string
     *         startTime: string
     *         endTime: string
     *         requestId: string
     *     }} options
     * @returns {Promise<IFunctionLogRes>}
     */
    getFunctionLogs(options: IFunctionLogOptions): Promise<IFunctionLogRes>;
    /**
     * 更新云函数配置
     * @param {ICloudFunction} func 云函数配置
     * @returns {Promise<IResponseInfo>}
     */
    updateFunctionConfig(func: ICloudFunction): Promise<IResponseInfo>;
    /**
     *
     * @param {IUpdateFunctionCodeParam} funcParam
     * @returns {Promise<IResponseInfo>}
     * @memberof FunctionService
     */
    updateFunctionCode(funcParam: IUpdateFunctionCodeParam): Promise<IResponseInfo>;
    /**
     * 调用云函数
     * @param {string} name 云函数名称
     * @param {Record<string, any>} params 调用函数传入参数
     * @returns {Promise<IFunctionInvokeRes>}
     */
    invokeFunction(name: string, params?: Record<string, any>): Promise<IFunctionInvokeRes>;
    /**
     * 复制云函数
     * @param {string} name 云函数名称
     * @param {string} newFunctionName 新的云函数名称
     * @param {string} targetEnvId 目标环境 Id
     * @param {boolean} [force=false] 是否覆盖同名云函数
     * @returns {Promise<IResponseInfo>}
     */
    copyFunction(name: string, newFunctionName: string, targetEnvId?: string, force?: boolean): Promise<IResponseInfo>;
    /**
     * 创建云函数触发器
     * @param {string} name 云函数名称
     * @param {ICloudFunctionTrigger[]} triggers 云函数触发器配置
     * @returns {Promise<IResponseInfo>}
     */
    createFunctionTriggers(name: string, triggers?: ICloudFunctionTrigger[]): Promise<IResponseInfo>;
    /**
     * 删除云函数触发器
     * @param {string} name 云函数名称
     * @param {string} triggerName 云函数触发器名称
     * @returns {Promise<IResponseInfo>}
     */
    deleteFunctionTrigger(name: string, triggerName: string): Promise<IResponseInfo>;
    /**
     * 获取云函数代码下载 链接
     * @param {string} functionName
     * @param {string} [codeSecret]
     * @returns {Promise<IFunctionDownloadUrlRes>}
     * @memberof FunctionService
     */
    getFunctionDownloadUrl(functionName: string, codeSecret?: string): Promise<IFunctionDownloadUrlRes>;
    createLayer(options: IFunctionLayerOptions): Promise<ICreateLayerResponse>;
    deleteLayerVersion(options: ILayerOptions): Promise<IResponseInfo>;
    listLayerVersions(options: IVersionListOptions): Promise<IListLayerVersionsRes>;
    listLayers(options: ILayerListOptions): Promise<IListLayerRes>;
    getLayerVersion(options: ILayerOptions): Promise<IGetLayerVersionRes>;
    private getCodeParams;
    private getTempCosInfo;
    private retryCreateTrigger;
    private retryUpdateFunctionCode;
    /**
     * 获取函数配置信息
     * @private
     * @returns
     * @memberof FunctionService
     */
    private getFunctionConfig;
    /**
     * 获取 vpc 信息
     * @returns
     */
    private getVpcs;
    /**
     * 获取子网
     * @param {string} vpcId
     * @returns
     */
    private getSubnets;
    private waitFunctionActive;
}
