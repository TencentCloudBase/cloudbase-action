"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
class CamService {
    constructor(context) {
        this.camService = new utils_1.CloudService(context, CamService.camServiceVersion.service, CamService.camServiceVersion.version);
    }
    /**
     * 查询账户角色列表
     * @param {number} page
     * @param {number} rp
     * @returns {Promise<IRoleListRes>}
     * @memberof CamService
     */
    async describeRoleList(page, rp) {
        const res = await this.camService.request('DescribeRoleList', {
            Page: page,
            Rp: rp
        });
        return res;
    }
    /**
     * 获取角色详情
     * @param {string} roleName
     * @returns {Promise<IGetRoleRes>}
     * @memberof CamService
     */
    async getRole(roleName) {
        const res = await this.camService.request('GetRole', {
            RoleName: roleName
        });
        return res;
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
    async createRole(param) {
        const res = await this.camService.request('CreateRole', param);
        return res;
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
    async attachRolePolicy(param) {
        const res = await this.camService.request('AttachRolePolicy', param);
        return res;
    }
    /**
     * 删除角色
     * @param {string} roleName
     * @returns {Promise<IResponseInfo>}
     * @memberof CamService
     */
    async deleteRole(roleName) {
        const res = await this.camService.request('DeleteRole', {
            RoleName: roleName
        });
        return res;
    }
}
exports.CamService = CamService;
CamService.camServiceVersion = {
    service: 'cam',
    version: '2019-01-16'
};
