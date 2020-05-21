import { Environment } from '../environment';
interface ICommonApiServiceOption {
    Action: string;
    Param: Record<string, any>;
}
/**
 * 公共的云api调用方法 透传用户参数 无业务逻辑处理
 * @export
 * @class CommonService
 */
export declare class CommonService {
    private commonService;
    private environment;
    constructor(environment: Environment, serviceType: string, serviceVersion: string);
    /**
     * 公共方法调用
     * @param {ICommonApiServiceParam} param
     * @returns {Promise<any>}
     * @memberof CommonService
     */
    call(options: ICommonApiServiceOption): Promise<any>;
}
export {};
