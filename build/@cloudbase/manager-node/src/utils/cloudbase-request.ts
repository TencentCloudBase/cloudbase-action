import { getAuth } from './auth'
import { fetch } from './http-request'

export async function cloudBaseRequest(options: {
    config: {
        envId: string
        secretId: string
        secretKey: string
        token?: string
        timeout?: number
        proxy: string
    }
    params: Record<string, any>
    method?: string
    headers?: Record<string, any>
}) {
    const url = 'https://tcb-admin.tencentcloudapi.com/admin'
    const { config, params = {}, method = 'POST', headers = {} } = options

    const requestData: any = {
        ...params,
        envName: config.envId,
        timestamp: Date.now()
    }

    const requestHeaders = {
        ...headers,
        'content-type': 'application/json',
        'user-agent': `cloudbase-manager-node/0.1.0`,
        'x-tcb-source': 'cloudbase-manager-node, not-scf'
    }

    const { secretId, secretKey, token, proxy } = config

    const authData = {
        secretId,
        secretKey,
        method: method,
        pathname: '/admin',
        params: requestData,
        headers: requestHeaders
    }

    const authorization = getAuth(authData)

    const requestBody = {
        ...requestData,
        sessionToken: token,
        authorization
    }

    const res = await fetch(
        url,
        {
            method,
            body: JSON.stringify(requestBody),
            headers: requestHeaders
        },
        process.env.TCB_ADMIN_PROXY || proxy
    )

    return res
}
