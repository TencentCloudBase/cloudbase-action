import fs from 'fs'
import archiver from 'archiver'
import crypto from 'crypto'
import { PUBLIC_RSA_KEY, ENV_NAME } from '../constant'

export { guid6 } from './uuid'
export * from './cloud-api-request'
export * from './auth'
export * from './cloudbase-request'
export * from './http-request'
export * from './envLazy'
export * from './fs'

interface IZipOption {
    dirPath: string
    outputPath: string
    ignore?: string | string[]
    pattern?: string
}

export async function compressToZip(option: IZipOption) {
    const { dirPath, outputPath, ignore, pattern = '**/*' } = option

    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputPath)
        const archive = archiver('zip')

        output.on('close', function() {
            resolve({
                zipPath: outputPath,
                size: Math.ceil(archive.pointer() / 1024)
            })
        })

        archive.on('error', function(err) {
            reject(err)
        })

        archive.pipe(output)
        // append files from a glob pattern
        archive.glob(pattern, {
            // 目标路径
            cwd: dirPath,
            ignore: ignore,
            dot: true
        })
        archive.finalize()
    })
}

export function getRuntime(): string {
    return process.env[ENV_NAME.ENV_RUNENV]
}

export function getEnvVar(envName: string): string {
    return process.env[envName]
}

export function rsaEncrypt(data: string): string {
    const buffer = Buffer.from(data)
    const encrypted = crypto.publicEncrypt(
        {
            key: PUBLIC_RSA_KEY,
            padding: crypto.constants.RSA_PKCS1_PADDING
        },
        buffer
    )
    return encrypted.toString('base64')
}

export function sleep(time: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}
