// // cloudbase cli 配置的字段名
// export class ConfigItems {
//     static credentail = 'credential'
// }

export const ENV_NAME = {
    ENV_SECRETID: 'TENCENTCLOUD_SECRETID',
    ENV_SECRETKEY: 'TENCENTCLOUD_SECRETKEY',
    ENV_SESSIONTOKEN: 'TENCENTCLOUD_SESSIONTOKEN',
    ENV_TCB_ENV_ID: 'TENCENTCLOUD_TCB_ENVID',
    ENV_RUNENV: 'TENCENTCLOUD_RUNENV',
    ENV_RUNENV_SCF: 'TENCENTCLOUD_RUNENV=SCF'
}

export const SDK_VERSION = 'TCB-NODE-MANAGER/1.0.O'

export const RUN_ENV = {
    SCF: 'SCF'
}

export const ENDPOINT = {
    TCB: 'tcb.tencentcloudapi.com',
    SCF: 'scf.tencentcloudapi.com',
    COS: 'cos.tencentcloudapi.com',
    FLEXDB: 'flexdb.ap-shanghai.tencentcloudapi.com'
}

export const SERVICE_TYPE = {
    TCB: 'tcb'
}

export const ERROR = {
    MISS_SECRET_INFO_IN_ENV: 'MISS_SECRET_INFO_IN_ENV',
    MISS_SECRET_INFO_IN_ARGS: 'MISS_SECRET_INFO_IN_ARGS',
    CURRENT_ENVIRONMENT_IS_NULL: 'CURRENT_ENVIRONMENT_IS_NULL',
    ENV_ID_NOT_EXISTS: 'ENV_ID_NOT_EXISTS'
}

export const PUBLIC_RSA_KEY = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0ZLB0ZpWWFsHPnDDw++Nc2wI3
nl2uyOrIJ5FUfxt4GAmt1Faf5pgMxAnL9exEUrrUDUX8Ri1R0KyfnHQQwCvKt8T8
bgILIJe9UB8e9dvFqgqH2oA8Vqwi0YqDcvFLFJk2BJbm/0QYtZ563FumW8LEXAgu
UeHi/0OZN9vQ33jWMQIDAQAB
-----END PUBLIC KEY-----
`
export const ROLE_NAME = {
    TCB: 'TCB_QcsRole'
}

export const SCF_STATUS = {
    ACTIVE: 'Active',
    CREATING: 'Creating',
    UPDATING: 'Updating'
}
