"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cos_nodejs_sdk_v5_1 = __importDefault(require("cos-nodejs-sdk-v5"));
const util_1 = __importDefault(require("util"));
const error_1 = require("../error");
const utils_1 = require("../utils");
const cam_1 = require("../cam");
const constant_1 = require("../constant");
const billing_1 = require("../billing");
class EnvService {
    constructor(environment) {
        this.environment = environment;
        this.envId = environment.getEnvId();
        this.cloudService = new utils_1.CloudService(environment.cloudBaseContext, 'tcb', '2018-06-08');
        this.camService = new cam_1.CamService(environment.cloudBaseContext);
        this.billService = new billing_1.BillingService(environment.cloudBaseContext);
    }
    /**
     * 列出所有环境
     * @returns {Promise<IListEnvRes>}
     */
    async listEnvs() {
        return this.cloudService.request('DescribeEnvs');
    }
    /**
     * 创建新环境
     * @param {string} name 环境名称
     * @returns {Promise<ICreateEnvRes>}
     */
    async createEnv(param) {
        // 1. 检查是否开通过TCB服务,若未开通，跳2检查角色  开通则跳5 创建环境
        // 2. 查询tcb 角色是否绑定该账户
        // 3. 若未绑定，则创建角色并绑定角色
        // 4. 开通TCB服务
        // 5. 创建环境
        // 6. 购买环境，选择预付费 或 后付费 套餐
        // 7. 若购买失败，将当前环境销毁，若购买成功，返回envId
        const { name, paymentMode, channel = 'qc_console' } = param;
        // 1. 检查TCB服务是否开通
        const { Initialized } = await this.checkTcbService();
        if (!Initialized) {
            // 跳2 查询TCB角色是否绑定
            let hasTcbRole = false;
            try {
                const res = await this.camService.getRole(constant_1.ROLE_NAME.TCB);
                hasTcbRole = true;
            }
            catch (e) {
                // 判断是否为角色不存在错误
                if (e.code !== 'InvalidParameter.RoleNotExist') {
                    throw e;
                }
            }
            if (!hasTcbRole) {
                // 3. 当前账户没有tcbRole，创建角色并绑定
                // 创建角色
                const createRoleResult = await this.camService.createRole({
                    RoleName: constant_1.ROLE_NAME.TCB,
                    Description: '云开发(TCB)操作权限含在访问管理(CAM)创建角色，新增角色载体，给角色绑定策略；含读写对象存储(COS)数据；含读写无服务器云函数(SCF)数据；含读取云监控(Monitor)数据。',
                    PolicyDocument: '{"version":"2.0","statement":[{"action":"sts:AssumeRole","effect":"allow","principal":{"service":["scf.qcloud.com","tcb.cloud.tencent.com"]}}]}'
                });
                const { RoleId } = createRoleResult;
                // 绑定角色策略
                await this.camService.attachRolePolicy({
                    PolicyId: 8825032,
                    AttachRoleName: constant_1.ROLE_NAME.TCB
                });
            }
            // 4. 未开通则初始化TCB
            await this.initTcb({ Channel: channel, Source: 'qcloud' });
        }
        // 5. 创建环境
        const params = {
            Alias: name,
            EnvId: `${name}-${utils_1.guid6()}`,
            Source: 'qcloud'
        };
        if (channel) {
            params.Channel = channel;
        }
        const { EnvId } = await this.cloudService.request('CreateEnv', params);
        const realPaymentMode = paymentMode ? paymentMode : 'postpay';
        // 6. 购买环境
        let prepayCreateDeal = false;
        let prepayPayDeal = false;
        let postpayDeal = false;
        let payError = null;
        if (realPaymentMode === 'prepay') {
            // 预付费
            // 1. 创建订单
            // 2. 支付订单
            const goods = [
                {
                    GoodsCategoryId: 101183,
                    // action: 'purchase',
                    // currency: 'CNY',
                    RegionId: 1,
                    ZoneId: 0,
                    GoodsNum: 1,
                    ProjectId: 0,
                    PayMode: 1,
                    Platform: 1,
                    GoodsDetail: JSON.stringify({
                        productCode: 'p_tcb',
                        subProductCode: 'sp_tcb_basic',
                        resourceId: EnvId,
                        pid: 16677,
                        timeUnit: 'm',
                        timeSpan: 1,
                        tcb_cos: 1,
                        tcb_cdn: 1,
                        tcb_scf: 1,
                        tcb_mongodb: 1,
                        region: 'ap-shanghai',
                        zone: 'ap-shanghai-1',
                        source: 'qcloud',
                        envId: EnvId,
                        packageId: 'basic',
                        isAutoRenew: 'true',
                        tranType: 1,
                        productInfo: [
                            {
                                name: '套餐版本',
                                value: '基础版 1'
                            },
                            {
                                name: '存储空间',
                                value: '5GB'
                            },
                            {
                                name: 'CDN流量',
                                value: '5GB'
                            },
                            {
                                name: '云函数资源使用量',
                                value: '4万GBs'
                            },
                            {
                                name: '数据库容量',
                                value: '2GB'
                            },
                            {
                                name: '数据库同时连接数',
                                value: '20个'
                            }
                        ]
                    })
                }
            ];
            let OrderIdsList = [];
            try {
                const { OrderIds } = await this.billService.GenerateDeals(goods);
                OrderIdsList = OrderIds;
                prepayCreateDeal = true;
            }
            catch (e) {
                // 预付费下单失败
                payError = e;
            }
            if (prepayCreateDeal) {
                // 下单成功
                try {
                    // 购买环境套餐
                    const { OrderIds: succOrderIds } = await this.billService.PayDeals(OrderIdsList);
                    // 判断订单是否支付成功
                    if (succOrderIds[0] === OrderIdsList[0]) {
                        prepayPayDeal = true;
                    }
                    else {
                        throw new error_1.CloudBaseError('支付成功的订单号不一致');
                    }
                }
                catch (e) {
                    // 预付费订单支付失败
                    payError = new error_1.CloudBaseError('预付费订单支付失败，请进入订单管理页面(https://console.cloud.tencent.com/deal)重新支付', {
                        original: e
                    });
                }
            }
        }
        if (realPaymentMode === 'postpay') {
            // 后付费
            try {
                const { TranId } = await this.CreatePostpayPackage(EnvId);
                postpayDeal = true;
            }
            catch (e) {
                payError = e;
            }
        }
        // 检查支付状态
        // 1. 预付费下单失败 删除环境
        // 2. 预付费下单成功过，支付订单失败，提示用户
        // 3. 后付费开通失败 删除环境
        if (realPaymentMode === 'prepay') {
            if (!prepayCreateDeal) {
                // 情形1
                await this.destroyEnv(EnvId);
                throw payError;
            }
            else {
                if (!prepayPayDeal) {
                    // 情形2
                    throw payError;
                }
            }
        }
        if (realPaymentMode === 'postpay') {
            if (!postpayDeal) {
                // 情形3
                await this.destroyEnv(EnvId);
                throw payError;
            }
        }
        // 成功返回envId
        return {
            envId: EnvId
        };
    }
    /**
     * 拉取安全域名列表
     * @returns {Promise<IAuthDomainsRes>}
     */
    async getEnvAuthDomains() {
        return this.cloudService.request('DescribeAuthDomains', {
            EnvId: this.envId
        });
    }
    /**
     * 添加环境安全域名
     * @param {string[]} domains 域名字符串数组
     * @returns {Promise<IResponseInfo>}
     */
    async createEnvDomain(domains) {
        const res = await this.cloudService.request('CreateAuthDomain', {
            EnvId: this.envId,
            Domains: domains
        });
        // 添加 COS CORS 域名
        const promises = domains.map(async (domain) => {
            this.modifyCosCorsDomain(domain);
        });
        await Promise.all(promises);
        return res;
    }
    /**
     * 删除环境安全域名
     * @param {string[]} domainIds 域名字符串数组
     * @returns {Promise<IDeleteDomainRes>}
     */
    async deleteEnvDomain(domains) {
        // 根据域名获取域名 Id
        const { Domains } = await this.getEnvAuthDomains();
        const domainIds = Domains.filter(item => domains.includes(item.Domain)).map(item => item.Id);
        const res = await this.cloudService.request('DeleteAuthDomain', {
            EnvId: this.envId,
            DomainIds: domainIds
        });
        // 删除 COS CORS 域名
        const promises = domains.map(async (domain) => {
            this.modifyCosCorsDomain(domain, true);
        });
        await Promise.all(promises);
        return res;
    }
    /**
     * 检查tcb服务是否开通
     * @returns {Promise<ICheckTcbServiceRes>}
     * @memberof CamService
     */
    async checkTcbService() {
        const res = await this.cloudService.request('CheckTcbService', {});
        return res;
    }
    /**
     * 初始化TCB
     * @returns {Promise<IResponseInfo>}
     * @memberof EnvService
     */
    async initTcb(param) {
        let initParam = {};
        if (param) {
            initParam = Object.assign({}, param);
        }
        const res = await this.cloudService.request('InitTcb', initParam);
        return res;
    }
    /**
     * 开通后付费套餐
     * @param {string} envId
     * @param {SOURCE} [source]
     * @returns {Promise<ICreatePostpayRes>}
     * @memberof EnvService
     */
    async CreatePostpayPackage(envId, source) {
        const realSource = source ? source : 'qcloud';
        const res = this.cloudService.request('CreatePostpayPackage', {
            EnvId: envId,
            Source: realSource
        });
        return res;
    }
    /**
     * 销毁环境
     * @param {string} envId
     * @returns {Promise<IResponseInfo>}
     * @memberof EnvService
     */
    async destroyEnv(envId) {
        const res = await this.cloudService.request('DestroyEnv', {
            EnvId: envId
        });
        return res;
    }
    /**
     * 获取环境信息
     * @returns {Promise<IEnvInfoRes>}
     */
    async getEnvInfo() {
        // NOTE: DescribeEnv 接口废弃，需要使用 DescribeEnvs 接口
        const { EnvList, RequestId } = await this.cloudService.request('DescribeEnvs', {
            EnvId: this.envId
        });
        return {
            EnvInfo: (EnvList === null || EnvList === void 0 ? void 0 : EnvList.length) ? EnvList[0] : {},
            RequestId
        };
    }
    /**
     * 修改环境名称
     * @param {string} alias 环境名称
     * @returns {Promise<IResponseInfo>}
     */
    async updateEnvInfo(alias) {
        return this.cloudService.request('ModifyEnv', {
            EnvId: this.envId,
            Alias: alias
        });
    }
    /**
     * 拉取登录配置列表
     * @returns {Promise<IEnvLoginConfigRes>}
     */
    async getLoginConfigList() {
        return this.cloudService.request('DescribeLoginConfigs', {
            EnvId: this.envId
        });
    }
    /**
     * 创建登录方式
     * 'WECHAT-OPEN'：微信开放平台
     * 'WECHAT-PUBLIC'：微信公众平台
     * @param {('WECHAT-OPEN' | 'WECHAT-PUBLIC')} platform 'WECHAT-OPEN' | 'WECHAT-PUBLIC'
     * @param {string} appId 微信 appId
     * @param {string} appSecret 微信 appSecret
     * @returns {Promise<IResponseInfo>}
     */
    async createLoginConfig(platform, appId, appSecret) {
        const validPlatform = ['WECHAT-OPEN', 'WECHAT-PUBLIC', 'QQ', 'ANONYMOUS'];
        let finalAppSecret = appSecret;
        if (!validPlatform.includes(platform)) {
            throw new error_1.CloudBaseError(`Invalid platform value: ${platform}. Now only support 'WECHAT-OPEN', 'WECHAT-PUBLIC', 'QQ', 'ANONYMOUS'`);
        }
        if (platform === 'ANONYMOUS') {
            finalAppSecret = 'anonymous';
        }
        return this.cloudService.request('CreateLoginConfig', {
            EnvId: this.envId,
            // 平台， “QQ" "WECHAT-OPEN" "WECHAT-PUBLIC"
            Platform: platform,
            PlatformId: appId,
            PlatformSecret: utils_1.rsaEncrypt(finalAppSecret),
            Status: 'ENABLE'
        });
    }
    /**
     * 更新登录方式配置
     * @param {string} configId 配置 Id，从配置列表中获取
     * @param {string} [status='ENABLE'] 是否启用 'ENABLE', 'DISABLE' ，可选
     * @param {string} [appId=''] 微信 appId，可选
     * @param {string} [appSecret=''] 微信 appSecret，可选
     * @returns {Promise<IResponseInfo>}
     */
    /* eslint-disable-next-line */
    async updateLoginConfig(configId, status = 'ENABLE', appId = '', appSecret = '') {
        const validStatus = ['ENABLE', 'DISABLE'];
        let finalAppSecret = appSecret;
        if (!validStatus.includes(status)) {
            throw new error_1.CloudBaseError(`Invalid status value: ${status}. Only support 'ENABLE', 'DISABLE'`);
        }
        const params = {
            EnvId: this.envId,
            ConfigId: configId,
            Status: status
        };
        if (appId === 'anonymous') {
            finalAppSecret = 'anonymous';
        }
        appId && (params.PlatformId = appId);
        finalAppSecret && (params.PlatformSecret = utils_1.rsaEncrypt(finalAppSecret));
        return this.cloudService.request('UpdateLoginConfig', params);
    }
    // 创建自定义登录私钥
    async createCustomLoginKeys() {
        const res = await this.cloudService.request('CreateCustomLoginKeys', {
            EnvId: this.envId
        });
        return res;
    }
    // 获取 COS CORS 域名
    async getCOSDomains() {
        const cos = this.getCos();
        const getBucketCors = util_1.default.promisify(cos.getBucketCors).bind(cos);
        const { bucket, region } = this.getStorageConfig();
        const res = await getBucketCors({
            Bucket: bucket,
            Region: region
        });
        return res.CORSRules;
    }
    // 添加 COS CORS 域名，和 Web 端行为保持一致
    async modifyCosCorsDomain(domain, deleted = false) {
        const cos = this.getCos();
        const putBucketCors = util_1.default.promisify(cos.putBucketCors).bind(cos);
        const { bucket, region } = this.getStorageConfig();
        // 去掉原有此域名CORS配置
        let corsRules = await this.getCOSDomains();
        corsRules = corsRules.filter(item => {
            return !(item.AllowedOrigins &&
                item.AllowedOrigins.length === 2 &&
                item.AllowedOrigins[0] === `http://${domain}` &&
                item.AllowedOrigins[1] === `https://${domain}`);
        });
        if (!deleted) {
            corsRules.push({
                AllowedOrigin: [`http://${domain}`, `https://${domain}`],
                AllowedMethod: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
                AllowedHeader: ['*'],
                ExposeHeader: ['Etag', 'Date'],
                MaxAgeSeconds: '5'
            });
        }
        await putBucketCors({
            Bucket: bucket,
            Region: region,
            CORSRules: corsRules
        });
    }
    getCos() {
        const { secretId, secretKey, token } = this.environment.getAuthConfig();
        if (!token) {
            return new cos_nodejs_sdk_v5_1.default({
                SecretId: secretId,
                SecretKey: secretKey
            });
        }
        return new cos_nodejs_sdk_v5_1.default({
            getAuthorization: function (_, callback) {
                callback({
                    TmpSecretId: secretId,
                    TmpSecretKey: secretKey,
                    XCosSecurityToken: token,
                    ExpiredTime: 3600 * 1000
                });
            }
        });
    }
    getStorageConfig() {
        const envConfig = this.environment.lazyEnvironmentConfig;
        const storageConfig = envConfig.Storages && envConfig.Storages[0];
        const { Region, Bucket } = storageConfig;
        return {
            env: envConfig.EnvId,
            region: Region,
            bucket: Bucket
        };
    }
}
__decorate([
    utils_1.preLazy()
], EnvService.prototype, "createEnvDomain", null);
__decorate([
    utils_1.preLazy()
], EnvService.prototype, "deleteEnvDomain", null);
exports.EnvService = EnvService;
