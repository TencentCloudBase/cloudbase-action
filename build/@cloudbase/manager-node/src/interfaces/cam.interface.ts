import { IResponseInfo } from './base.interface'

interface IRoleInfo {
    RoleId: string // 角色ID
    RoleName: string // 角色名称
    PolicyDocument: string // 角色策略文档
    Description: string // 角色描述
    AddTime: string // 角色创建时间
    UpdateTime: string // 角色的最近一次时间
    ConsoleLogin: number // 角色是否允许登录
}

export interface IRoleListRes extends IResponseInfo {
    List: Array<IRoleInfo>
    TotalNum: number
}

export interface ICreateRoleRes extends IResponseInfo {
    RoleId: string
}

export interface ICheckTcbServiceRes extends IResponseInfo {
    Initialized: boolean
}

export interface IGetRoleRes extends IResponseInfo {
    RoleInfo: IRoleInfo
}
