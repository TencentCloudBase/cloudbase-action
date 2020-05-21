import { CloudService } from '../utils'
import { CloudBaseContext } from '../context'
import {
    IServiceVersion,
    IRoleListRes,
    ICreateRoleRes,
    IResponseInfo,
    IGetRoleRes
} from '../interfaces'

export class CamService {
    static camServiceVersion: IServiceVersion = {
        service: 'cam',
        version: '2019-01-16'
    }
    private camService: CloudService

    constructor(context: CloudBaseContext) {
        this.camService = new CloudService(
            context,
            CamService.camServiceVersion.service,
            CamService.camServiceVersion.version
        )
    }

    /**
     * 查询账户角色列表
     * @param {number} page
     * @param {number} rp
     * @returns {Promise<IRoleListRes>}
     * @memberof CamService
     */
    public async describeRoleList(page: number, rp: number): Promise<IRoleListRes> {
        const res = await this.camService.request('DescribeRoleList', {
            Page: page,
            Rp: rp
        })
        return res
    }

    /**
     * 获取角色详情
     * @param {string} roleName
     * @returns {Promise<IGetRoleRes>}
     * @memberof CamService
     */
    public async getRole(roleName: string): Promise<IGetRoleRes> {
        const res = await this.camService.request('GetRole', {
            RoleName: roleName
        })
        return res
    }

    /**
     * 创建角色
     * @param {{
     *         RoleName: string
     *         PolicyDocument: string
     *         Description: string
     *     }} param
     * @returns {Promise<ICreateRoleRes>}
     * @memberof CamService
     */
    public async createRole(param: {
        RoleName: string
        PolicyDocument: string
        Description: string
    }): Promise<ICreateRoleRes> {
        const res = await this.camService.request('CreateRole', param)
        return res
    }

    /**
     * 绑定角色策略
     * @param {{
     *         PolicyId: number
     *         AttachRoleName: string
     *     }} param
     * @returns {Promise<IResponseInfo>}
     * @memberof CamService
     */
    public async attachRolePolicy(param: {
        PolicyId: number
        AttachRoleName: string
    }): Promise<IResponseInfo> {
        const res = await this.camService.request('AttachRolePolicy', param)
        return res
    }

    /**
     * 删除角色
     * @param {string} roleName
     * @returns {Promise<IResponseInfo>}
     * @memberof CamService
     */
    public async deleteRole(roleName: string): Promise<IResponseInfo> {
        const res = await this.camService.request('DeleteRole', {
            RoleName: roleName
        })
        return res
    }
}
