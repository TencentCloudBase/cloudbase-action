export interface IFunctionVPC {
    subnetId: string
    vpcId: string
}

export interface ICloudFunctionTrigger {
    name: string
    type: string
    config: string
}

// 支持的函数配置
export interface ICloudFunctionConfig {
    timeout?: number
    envVariables?: Record<string, string | number | boolean>
    runtime?: string
    vpc?: IFunctionVPC
    installDependency?: boolean
    l5?: boolean
    memorySize?: number
}

export interface LayerVersionSimple {
    LayerName: string // layer名称
    LayerVersion: number // 版本号
}

export interface ICloudFunction extends ICloudFunctionConfig {
    name: string
    triggers?: ICloudFunctionTrigger[]
    handler?: string
    ignore?: string | string[]
    isWaitInstall?: boolean
    layers?: LayerVersionSimple[]
}

export interface IFunctionLogOptions {
    name: string
    offset?: number
    limit?: number
    order?: string
    orderBy?: string
    startTime?: string
    endTime?: string
    requestId?: string
}

export interface IFunctionInvokeRes {
    RequestId: string // 请求 Id
    Log: string // 表示执行过程中的日志输出
    RetMsg: string // 表示执行函数的返回
    ErrMsg: string // 表示执行函数的错误返回信息
    MemUsage: number // 执行函数时的内存大小，单位为Byte
    Duration: number // 表示执行函数的耗时，单位是毫秒
    BillDuration: number // 表示函数的计费耗时，单位是毫秒
    FunctionRequestId: string // 此次函数执行的Id
}

export interface IFunctionLogRes {
    RequestId: string // 请求 Id
    Data: []
    TotalCount: number
}

export interface IFunctionDownloadUrlRes {
    Url: string
    RequestId: string
    CodeSha256: string
}
