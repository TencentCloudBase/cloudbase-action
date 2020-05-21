export interface IExistsRes {
    RequestId: string
    Msg?: string
    Exists: boolean
}
export interface IDatabaseTableReq {
    Tag: string
    TableName: string
}

export interface IndexInfo {
    // 索引名称
    Name: string
    // 索引大小，单位: 字节
    Size: number
    // 索引键值
    Keys: Indexkey[]
    // 索引使用信息
    Accesses: IndexAccesses
    // 是否为唯一索引
    Unique: boolean
}
export interface IndexAccesses {
    // 索引命中次数
    Ops: number
    // 命中次数从何时开始计数
    Since: string
}
export interface Indexkey {
    // 键名
    Name?: string
    // 方向：specify 1 for ascending or -1 for descending
    Direction?: string
}
export interface DropIndex {
    // 索引名称
    IndexName: string
}
export interface CreateIndex {
    // 索引名称
    IndexName: string
    // 索引结构
    MgoKeySchema: MgoKeySchema
}
export interface MgoKeySchema {
    // 索引字段
    MgoIndexKeys: MgoIndexKeys[]
    // 是否为唯一索引
    MgoIsUnique: boolean
}
export interface Pager {
    // 分页偏移量
    Offset: number
    // 每页返回记录数
    Limit: number
    // 文档集合总数
    Total: number
}
export interface MgoIndexKeys {
    // 索引字段名
    Name: string
    // 索引类型，当前支持1,-1,2d
    Direction: string
}
export interface TableInfo {
    // 表名
    CollectionName: string
    // 表中文档数量
    Count: number
    // 表的大小（即表中文档总大小），单位：字节
    Size: number
    // 索引数量
    IndexCount: number
    // 索引占用空间，单位：字节
    IndexSize: number
}
export interface GoodsDetail {
    // 配额id
    QuataId: string
    // 存储GB
    DiskSize?: number
    // 同时连接数
    ConnNum?: number
    // 读操作数
    ReadOperands?: number
    // 写操作数
    WriteOperands?: number
    // 集合限制
    CollectionLimits?: number
    // 单集合索引限制
    SingleCollectionIndexLimits?: number
}
export interface ResourceAmount {
    // 已用磁盘容量，单位为MB
    UsedDiskSize?: number
    // 当天已消耗读请求个数
    ReadOperands?: number
    // 当天已消耗写请求个数
    WriteOperands?: number
    // 已创建表个数
    TableNum?: number
}
