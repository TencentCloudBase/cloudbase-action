"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const error_1 = require("../error");
/**
 * 公共的云api调用方法 透传用户参数 无业务逻辑处理
 * @export
 * @class CommonService
 */
class CommonService {
    constructor(environment, serviceType, serviceVersion) {
        this.environment = environment;
        if (serviceType === 'tcb') {
            this.commonService = new utils_1.CloudService(environment.cloudBaseContext, 'tcb', serviceVersion || '2018-06-08');
        }
        if (serviceType === 'flexdb') {
            this.commonService = new utils_1.CloudService(environment.cloudBaseContext, 'flexdb', serviceVersion || '2018-11-27');
        }
        if (serviceType === 'scf') {
            this.commonService = new utils_1.CloudService(environment.cloudBaseContext, 'scf', serviceVersion || '2018-04-16');
        }
    }
    /**
     * 公共方法调用
     * @param {ICommonApiServiceParam} param
     * @returns {Promise<any>}
     * @memberof CommonService
     */
    async call(options) {
        const { Action, Param = {} } = options;
        if (!Action) {
            throw new error_1.CloudBaseError('缺少必填参数 Action');
        }
        const res = await this.commonService.request(Action, Object.assign({}, Param));
        return res;
    }
}
exports.CommonService = CommonService;
