import { Environment } from '../environment'
import { CloudService } from '../utils'

export class ThirdService {
    private cloudService: CloudService

    constructor(environment: Environment) {
        this.cloudService = new CloudService(environment.cloudBaseContext, 'tcb', '2018-06-08')
    }

    // 解除第三方小程序绑定
    async deleteThirdPartAttach(options: {
        ThirdPartAppid: string
        TypeFlag: number
    }): Promise<{
        RequestId: string
    }> {
        const { ThirdPartAppid, TypeFlag } = options
        return this.cloudService.request('DeleteThirdPartAttach', {
            ThirdPartAppid,
            TypeFlag
        })
    }
}
