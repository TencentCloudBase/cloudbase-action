import { IResponseInfo } from './base.interface'

export interface EndUserInfo {
    // 用户唯一ID
    UUId?: string
    // 微信ID
    WXOpenId?: string
    // qq ID
    QQOpenId?: string
    // 手机号
    Phone?: string
    // 邮箱
    Email?: string
    // 昵称
    NickName?: string
    // 性别
    Gender?: string
    // 头像地址
    AvatarUrl?: string
    // 更新时间
    UpdateTime?: string
    // 创建时间
    CreateTime?: string
}
export interface AuthDomain {
    // 域名ID
    Id?: string
    // 域名
    Domain?: string
    // 域名类型。包含以下取值：
    // <li>system</li>
    // <li>user</li>
    Type?: string
    // 状态。包含以下取值：
    // <li>ENABLE</li>
    // <li>DISABLE</li>
    Status?: string
    // 创建时间
    CreateTime?: string
    // 更新时间
    UpdateTime?: string
}
export interface LoginConfigItem {
    // 第三方平台。包含以下取值：
    // <li>wechat</li>
    // <li>qq</li>
    Platform?: string
    // 第三方平台的AppId
    PlatformId?: string
    // 创建时间
    CreateTime?: string
    // 更新时间
    UpdateTime?: string
    // 状态
    Status?: string
    // 本条记录的ID
    Id?: string
}
export interface FunctionLimit {
    // 函数个数限制
    NumberLimit?: number
    // 执行次数限制，次数/每月
    CallLimit?: LimitInfo
    // 资源使用量GBs限制，m是每月
    ResourceUsageLimit?: LimitInfo
    // 并发数限制个数
    ConcurrentLimit?: number
    // 外网出流量，GB/月
    OutboundTrafficLimit?: LimitInfo
}
export interface StorageLimit {
    // 存储的容量，单位 MB
    CapacityLimit?: number
    // 下载次数，次数/每天，d是每天
    DownloadLimit?: LimitInfo
    // 上传次数限制，次数/每天，d是每天
    UploadLimit?: LimitInfo
    // cdn 回源流量限制，单位 MB，m是每月
    CdnOriginFlowLimit?: LimitInfo
    // cdn 流量限制，单位 MB，m是每月
    CdnFlowLimit?: LimitInfo
    // 上传次数限制，次数/每月，m是每月
    UploadLimitMonthly?: LimitInfo
    // 下载次数，次数/每月，m是每月
    DownloadLimitMonthly?: LimitInfo
}
export interface DatabaseLimit {
    // 数据库存储容量 MB
    CapacityLimit?: number
    // 连接数限制
    ConnectionLimit?: number
    // 集合数限制
    CollectionLimit?: number
    // 索引限制
    IndexLimit?: number
    // 读次数限制，次数/每天
    ReadLimit?: LimitInfo
    // 写次数限制，次数/每天
    WriteLimit?: LimitInfo
    // qps 限制
    QPSLimit?: number
}
export interface LimitInfo {
    // 最大用量。包含以下取值：
    // <li>API次数</li>
    // <li>storage流量。单位：MB</li>
    // <li>function使用量。单位：GBs</li>
    MaxSize?: number
    // 用量计算周期。包含以下取值：
    // <li>小时(h)</li>
    // <li>天(d)</li>
    // <li>年(y)</li>
    TimeUnit?: string
}
export interface UserInfo {
    // openid
    OpenId?: string
    // 是否授权
    GrantUserInfo?: boolean
    // 昵称
    NickName?: string
    // 国家
    Country?: string
    // 省份
    Province?: string
    // 城市
    City?: string
    // 性别。包含以下取值：
    // <li> 1：男</li>
    // <li> 2：女</li>
    // <li> 0：未知</li>
    Gender?: number
    // 语言
    Language?: string
    // 头像
    AvatarUrl?: string
    // 创建时间
    CreateTime?: string
    // 修改时间
    UpdateTime?: string
}
export interface ResourcesInfo {
    // 资源类型。包含以下取值：
    // <li> database </li>
    // <li> storage </li>
    // <li> functions</li>
    ResourceType?: string
    // 资源标识，对应 db_name 或 fs_name，云函数不需要传。
    ResourceName: string
    // 资源用量状态。包含以下取值：
    // <li> 1：安全</li>
    // <li> 2：警告</li>
    // <li> 3：超额</li>
    // <li> 4：停服</li>
    Status: number
    // 资源额定容量。包含以下取值：
    // <li> cos 单位：MB </li>
    // <li> db 单位：MB </li>
    // <li> scf 单位：函数个数</li>
    MaxSize: number
    // 当前用量
    CurSize: number
    // 单位，仅做参考&前台展示
    Unit: string
}
export interface InvoicePostInfo {
    // 地址ID，邮寄地址的唯一标识；新增发票地址时不传；
    PostId: string
    // 联系人姓名
    Contact?: string
    // 省份
    Province?: string
    // 城市
    City?: string
    // 详细地址
    Address?: string
    // 邮政编码
    PostalCode?: string
    // 手机号码或座机号码
    Cellphone?: string
}
export interface RecoverResult {
    // 处理结果：
    // Success : 成功
    // Fail: 失败
    // Async: 异步处理
    Result?: string
    // 当 Result=Fail 时有值，表示失败原因
    ErrorMessage: string
    // 当 Result=Async 是有值，表示异步任务ID
    RecoverJobId: string
}
export interface RecoverJobStatus {
    // 任务ID
    JobId?: string
    // 任务状态：
    // Waiting:等待执行, Doing:执行中, Done:处理完成, Error:处理失败
    Status?: string
    // 错误信息（当Status=Error时有值）
    ErrorMessage: string
}
export interface StorageException {
    // 桶名，存储资源的唯一标识
    Bucket?: string
    // Normal:正常， BucketMissing:bucket被删， Recovering:正在恢复中
    COSStatus?: string
    // 当 COSStatus=Recovering时有值，表示当前异步任务ID
    COSRecoverJobId: string
}
export interface LogServiceException {
    // 日志集名称，该日志的唯一标识
    LogsetName?: string
    // 日志集状态：
    // Normal: 正常
    // Missing: 资源不存在
    // FunctionUpdating: 正在更新存量云函数
    // FunctionUpdateFail: 批量更新云函数失败
    Status?: string
    // 更新函数的任务ID
    FunctionUpdateJobId: string
}
export interface EnvInfo {
    // 账户下该环境唯一标识
    EnvId?: string
    // 环境来源。包含以下取值：
    // <li>miniapp：微信小程序</li>
    // <li>qcloud ：腾讯云</li>
    Source?: string
    // 环境别名，要以a-z开头，不能包含 a-zA-z0-9- 以外的字符
    Alias?: string
    // 创建时间
    CreateTime?: string
    // 最后修改时间
    UpdateTime?: string
    // 环境状态。包含以下取值：
    // <li>NORMAL：正常可用</li>
    // <li>UNAVAILABLE：服务不可用，可能是尚未初始化或者初始化过程中</li>
    Status?: string
    // 数据库列表
    Databases?: DatabasesInfo[]
    // 存储列表
    Storages?: StorageInfo[]
    // 函数列表
    Functions?: FunctionInfo[]
    // tcb产品套餐ID，参考DescribePackages接口的返回值。
    PackageId: string
    // 套餐中文名称，参考DescribePackages接口的返回值。
    PackageName: string
    // 云日志服务列表
    LogServices: LogServiceInfo[]
}
export interface FunctionInfo {
    // 命名空间
    Namespace?: string
    // 所属地域。
    // 当前支持ap-shanghai
    Region?: string
}
export interface DatabasesInfo {
    // 数据库唯一标识
    InstanceId?: string
    // 状态。包含以下取值：
    // <li>INITIALIZING：资源初始化中</li>
    // <li>RUNNING：运行中，可正常使用的状态</li>
    // <li>UNUSABLE：禁用，不可用</li>
    // <li>OVERDUE：资源过期</li>
    Status?: string
    // 所属地域。
    // 当前支持ap-shanghai
    Region?: string
}
export interface StorageInfo {
    // 资源所属地域。
    // 当前支持ap-shanghai
    Region?: string
    // 桶名，存储资源的唯一标识
    Bucket?: string
    // cdn 域名
    CdnDomain?: string
    // 资源所属用户的腾讯云appId
    AppId?: string
}
export interface LogServiceInfo {
    // log名
    LogsetName?: string
    // log-id
    LogsetId?: string
    // topic名
    TopicName?: string
    // topic-id
    TopicId?: string
    // cls日志所属地域
    Region?: string
}
export interface VoucherUseHistory {
    // 代金券编号
    VoucherId?: string
    // 代金券本次使用金额
    UsedAmount?: number
    // 代金券使用时间
    UsedTime?: string
    // 代金券支付信息
    PayInfo?: string
    // 代金券使用序列号
    SeqId?: string
}
export interface Volucher {
    // 代金券编号
    VoucherId?: string
    // 代金券拥有者
    OwnerUin?: string
    // 代金券总额，单位：元
    Amount?: number
    // 代金券余额，单位：元
    LeftAmount?: number
    // 使用截止期，型如：2018-05-30 23:59:59
    UseDeadLine?: string
    // 仅 DescribeVouchersInfo 接口返回该字段；
    // 包含以下值：
    // <li>1：待使用</li>
    // <li>3：已使用</li>
    // <li>4：已过期</li>
    // <li>6：已作废</li>
    Status: number
    // 代金券使用门槛，单位：元
    BaseAmount?: number
}
export interface PackageInfo {
    // tcb产品套餐ID
    PackageId?: string
    // 套餐中文名称
    Name?: string
    // 套餐描述
    Desc?: string
    // 套餐详情，json字符串。包含以下取值：
    //
    // 云函数
    // <li> InvokeTimes：调用次数。单位：万次</li>
    // <li> MemoryUse：资源使用量GBs。单位：万GBS </li>
    // <li> Outflow：外网出流量。单位：GB </li>
    // <li> Concurrency：（单个云函数）并发数。单位：个</li>
    // <li> FunctionNum：函数数量。单位：个</li>
    //
    // CDN
    // <li> FlowSize：CDN流量。单位：GB </li>
    //
    // 文件存储
    // <li> CapacityLimit：容量。单位：GB/月</li>
    // <li> CdnOriginFlowLimit：CDN回源流量。单位：GB/月</li>
    // <li> DownloadLimit：下载操作次数。单位：次</li>
    // <li> UploadLimit：上传操作次数。单位：次</li>
    //
    // 数据库
    // <li> DiskSize：容量。单位：GB </li>
    // <li> ConnNum：同时连接数。单位：个</li>
    // <li> ReadOperands：读操作次数。单位：次</li>
    // <li> WriteOperands：写操作次数。单位：次</li>
    // <li> CollectionLimits：集合限制。单位：个</li>
    // <li> SingleCollectionIndexLimits：单集合索引限制。单位：个</li>
    Detail?: string
}
export interface EnvBillingInfoItem {
    // 环境ID
    EnvId?: string
    // tcb产品套餐ID，参考DescribePackages接口的返回值。
    PackageId?: string
    // 自动续费标记
    IsAutoRenew?: boolean
    // 状态。包含以下取值：
    // <li> NORMAL：正常</li>
    // <li> ISOLATE：隔离</li>
    Status?: string
    // 支付方式。包含以下取值：
    // <li> PREPAYMENT：预付费</li>
    // <li> POSTPAID：后付费</li>
    PayMode?: string
    // 隔离时间，最近一次隔离的时间
    IsolatedTime?: string
    // 过期时间，套餐即将到期的时间
    ExpireTime?: string
    // 创建时间，第一次接入计费方案的时间。
    CreateTime?: string
    // 更新时间，计费信息最近一次更新的时间。
    UpdateTime?: string
    // true表示从未升级过付费版。
    IsAlwaysFree?: boolean
}
export interface InvoiceVATGeneral {
    // 税务登记号类型：
    // CompanyCreditCode 社会统一信用代码：
    // TaxNumber 税务登记号
    TaxPayerType?: string
    // 纳税人识别号号码
    // 如果是 社会统一信用代码，则长度必须为 18位
    // 如果是 税务登记号，则长度介于 15~20之间(含)
    TaxPayerNumber?: string
    // 开户行
    BankDeposit?: string
    // 银行账号
    BankAccount?: string
    // 注册场所地址：请填写税务登记证上的地址或经营场所地址
    RegisterAddress?: string
    // 注册固定电话
    RegisterPhone?: string
}
export interface InvoiceVATSpecial {
    // 纳税人识别号（请填写15到20位有效税务登记证号或三证合一后的社会统一信用代码）
    TaxPayerNumber?: string
    // 开户行
    BankDeposit?: string
    // 银行账号
    BankAccount?: string
    // 注册场所地址：请填写税务登记证上的地址或经营场所地址
    RegisterAddress?: string
    // 注册固定电话
    RegisterPhone?: string
}
export interface InvoiceBasicInfo {
    // 发票ID
    InvoiceId?: string
    // 发票类型：
    // Personal 个人-普通发票
    // CompanyVAT 公司-增值税普通发票
    // CompanyVATSpecial 公司-增值税专用发票
    // Organization 组织-增值税普通发票
    UserType?: string
    // 发票金额（单位：元，人民币）
    Amount?: number
    // 发票状态：
    // PROCESSING 处理中
    // INVOICED 已开票
    // MAILED 已邮寄
    // OBSOLETED 已作废
    // INVOICING 开票中
    // CANCELED 已取消
    // VIRTUAL 虚拟发票
    // OBSOLETING 作废中
    // MAIL_SIGNED 邮件已签收
    // REFUND_WAIT 退票待处理
    // REFUND_DENY 退票驳回
    Status?: string
    // 开票时间
    InvoiceTime?: string
}
export interface QuotaOverlimit {
    // 所属资源。包含以下取值：
    // <li>SCF</li>
    // <li>CDN</li>
    // <li>COS</li>
    // <li>FLEXDB</li>
    ResourceName?: string
    // 配额英文名称。包含以下取值：
    //
    // CDN指标名：
    // <li> TrafficLimit：CDN流量。单位：字节 </li>
    // SCF指标名
    // <li> FunctionCallTimeLimit：调用次数 </li>
    // <li> ResourceAmountLimit：云资源使用量。单位：GBS </li>
    // <li> TrafficLimit：外网出流量。单位：字节 </li>
    // <li> FunctionNum：云函数个数 </li>
    // FLEXDB指标名
    // <li> StorageLimit：db存储容量。单位：MB </li>
    // <li> ReadOpLimit：读操作数 </li>
    // <li> WriteOpLimit：写操作数 </li>
    // <li> FunctionNum：表个数限制 </li>
    // COS指标名
    // <li> StorageLimit：存储的容量。单位：MB </li>
    // <li> ReadRequsetsLimit：下载操作次数 </li>
    // <li> WriteRequsetsLimit：上传操作次数 </li>
    // <li> InternetTrafficLimit：外网下行容量。单位：字节 </li>
    // <li> CdnTrafficLimit：CDN回源流量。单位：字节 </li>
    QuotaName?: string
    // 配额中文名
    QuotaChName?: string
    // 已使用配额量
    QuotaUsaged?: number
    // 配额单位
    Unit?: string
    // 其它信息. 目前仅在FLEXDB资源中有效, 会将数据库实例写到Comments字段.
    Comments: string
}
export interface InvoiceAmountOverlimit {
    // 发票金额是否超限
    IsAmountOverlimit?: boolean
    // 退款金额(仅在降级时有值，为实际退换的金额，单位：元。)
    RefundAmount?: number
    // 可申请发票金额，单位：元
    InvoiceAmount?: number
}
export interface DealInfo {
    // 订单号，tcb订单唯一标识
    TranId?: string
    // 创建者的腾讯云账号id
    DealOwner?: string
    // 订单创建时间，例如 "2019-01-01 00:00:00"
    CreateTime?: string
    // tcb产品套餐ID，参考DescribePackages接口的返回值。
    PackageId?: string
    // 订单状态。包含以下取值：
    // <li>1 ：未支付</li>
    // <li>2 ：支付中</li>
    // <li>3 ：发货中</li>
    // <li>4 ：发货成功</li>
    // <li>6 ：已退款</li>
    // <li>7 ：已取消</li>
    DealStatus?: number
    // 订单实际支付费用（单位元）
    DealCost?: number
    // 环境ID
    EnvId?: string
    // 订单支付时间，例如 "2019-01-01 00:00:00"
    PayTime?: string
    // 订单时长
    TimeSpan?: number
    // 套餐单价（单位元）
    Price?: number
    // 付费模式。包含以下取值：
    // <li>1 ：预付费</li>
    // <li>2 ：后付费</li>
    PayMode?: number
    // 固定为tcp_ mp
    ProductName?: string
    // 订单时长单位，目前只支持月：m
    TimeUnit?: string
    // 订单退费金额，例如需要退费200元，则该值为200
    RefundAmount?: number
    // DealStatus字段为7时，这里返回具体的状态原因。
    DealStatusDes: string
    // 订单支付时，代金券抵用的金额；未支付订单、降配订单，该值为0
    VoucherDecline: number
    // DealStatus = 1时有效；订单是否拉取过payCode，拉取过，true；未拉取过：false
    HasReturnPayCode: boolean
}
export interface MonitorResource {
    // 资源名，如云函数
    Name?: string
    // 支持的指标名称列表，如云函数运行时间
    Index?: string[]
    // 支持的统计的周期，如300秒、3600秒
    Period?: number[]
    // 指标英文名
    EnIndex?: string[]
    // 资源英文名，如Function
    EnName?: string
    // 指标单位
    IndexUnit?: string[]
    // 收敛周期（秒）
    Convergence?: number[]
    // 收敛周期名，如1小时1次
    ConvergenceName?: string[]
}
export interface CollectionDispension {
    // 集合名
    CollectionName?: string
    // 文档数量
    DocCount?: number
}
export interface MonitorPolicyInfo {
    // 策略名称
    Name?: string
    // 策略ID
    PolicyId: number
    // 备注
    Note?: string
    // 告警收敛周期
    Convergence?: number
    // 资源类型，如Function
    ResType: string
    // 资源名，如Function为AppId，CDN为域名
    ResName: string
    // 资源对象名，如Function为函数名，Database为collection名
    Objects: string[]
}
export interface FileDownloadRespInfo {
    // 文件id
    FileId?: string
    // 访问链接
    DownloadUrl?: string
    // 错误码，成功为SUCCESS
    Code?: string
}
export interface FileDownloadReqInfo {
    // 文件id
    FileId?: string
    // 链接有效期，单位秒（private需要）
    TTL: number
}
export interface FileDeleteInfo {
    // 文件唯一id
    FileId?: string
    // 删除操作结果
    Code?: string
}
export interface CommParam {
    // 微信公众平台用户openid
    OpenId: string
    // tcb环境ID
    EnvName?: string
    // 服务模块。包含以下取值：
    // <li>functions</li>
    // <li>storage</li>
    // <li>database</li>
    Module?: string
}

export interface CloudBaseGWAPI {
    ServiceId: string
    APIId: string
    Path: string
    Type: number
    Name: string
    CreateTime: number
}

export interface CloudBaseGWService {
    ServiceId: string
    Domain: string
    OpenTime: number
}

export interface ICreatePostpayRes extends IResponseInfo {
    TranId: string
}

export interface ICreateFunctionHttpServiceRes extends IResponseInfo {
    APIId: string
    Endpoint: string
}

export interface IGWOrDomainNumRes extends IResponseInfo {
    Count: number
}

export interface IHttpServiceDomainRes extends IResponseInfo {
    ServiceSet: Array<CloudBaseGWService>
}
