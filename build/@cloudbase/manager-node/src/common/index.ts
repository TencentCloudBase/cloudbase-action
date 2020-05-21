import { CloudService, preLazy } from '../utils'
import { CloudBaseContext } from '../context'
import { CloudBaseError } from '../error'
import { Environment } from '../environment'

interface ICommonApiServiceOption {
    Action: string // 接口名称
    Param: Record<string, any> // 接口传参
}
/**
 * 公共的云api调用方法 透传用户参数 无业务逻辑处理
 * @export
 * @class CommonService
 */
export class CommonService {
    private commonService: CloudService
    private environment: Environment

    constructor(environment: Environment, serviceType: string, serviceVersion: string) {
        this.environment = environment
        if (serviceType === 'tcb') {
            this.commonService = new CloudService(
                environment.cloudBaseContext,
                'tcb',
                serviceVersion || '2018-06-08'
            )
        }
        if (serviceType === 'flexdb') {
            this.commonService = new CloudService(
                environment.cloudBaseContext,
                'flexdb',
                serviceVersion || '2018-11-27'
            )
        }
        if (serviceType === 'scf') {
            this.commonService = new CloudService(
                environment.cloudBaseContext,
                'scf',
                serviceVersion || '2018-04-16'
            )
        }
    }

    /**
     * 公共方法调用
     * @param {ICommonApiServiceParam} param
     * @returns {Promise<any>}
     * @memberof CommonService
     */
    public async call(options: ICommonApiServiceOption): Promise<any> {
        const { Action, Param = {} } = options
        if (!Action) {
            throw new CloudBaseError('缺少必填参数 Action')
        }

        const res = await this.commonService.request(Action, { ...Param })

        return res
    }
}
