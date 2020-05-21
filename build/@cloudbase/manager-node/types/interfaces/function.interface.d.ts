export interface IFunctionVPC {
    subnetId: string;
    vpcId: string;
}
export interface ICloudFunctionTrigger {
    name: string;
    type: string;
    config: string;
}
export interface ICloudFunctionConfig {
    timeout?: number;
    envVariables?: Record<string, string | number | boolean>;
    runtime?: string;
    vpc?: IFunctionVPC;
    installDependency?: boolean;
    l5?: boolean;
    memorySize?: number;
}
export interface LayerVersionSimple {
    LayerName: string;
    LayerVersion: number;
}
export interface ICloudFunction extends ICloudFunctionConfig {
    name: string;
    triggers?: ICloudFunctionTrigger[];
    handler?: string;
    ignore?: string | string[];
    isWaitInstall?: boolean;
    layers?: LayerVersionSimple[];
}
export interface IFunctionLogOptions {
    name: string;
    offset?: number;
    limit?: number;
    order?: string;
    orderBy?: string;
    startTime?: string;
    endTime?: string;
    requestId?: string;
}
export interface IFunctionInvokeRes {
    RequestId: string;
    Log: string;
    RetMsg: string;
    ErrMsg: string;
    MemUsage: number;
    Duration: number;
    BillDuration: number;
    FunctionRequestId: string;
}
export interface IFunctionLogRes {
    RequestId: string;
    Data: [];
    TotalCount: number;
}
export interface IFunctionDownloadUrlRes {
    Url: string;
    RequestId: string;
    CodeSha256: string;
}
