export interface IUploadMetadata {
    token: string
    url: string
    authorization: string
    fileId: string
    cosFileId: string
    download_url: string
}

export interface IListFileInfo {
    Key: string // 对象键
    LastModified: string //	对象最后修改时间，为 ISO8601 格式，如2019-05-24T10:56:40Z	date
    ETag: string //	对象的实体标签（Entity Tag），是对象被创建时标识对象内容的信息标签，可用于检查对象的内容是否发生变化
    Size: string // 对象大小，单位为 Byte
    Owner: string // 对象持有者信息
    StorageClass: string // 对象存储类型，标准存储 STANDARD
}

export interface IFileInfo {
    Size: string // 文件大小 KB
    Type: string // 文件类型
    Date: string // 修改时间
    ETag: string // 对象的实体标签（Entity Tag）
}

export interface ITempUrlInfo {
    cloudPath: string
    maxAge?: number // 单位：秒
}
