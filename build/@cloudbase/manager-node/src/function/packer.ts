import fs from 'fs'
import del from 'del'
import path from 'path'
import makeDir from 'make-dir'
import util from 'util'
import { compressToZip, checkFullAccess } from '../utils'
import { CloudBaseError } from '../error'

// 10 MB
export const BIG_FILE_SIZE = 10485760
export const API_MAX_SIZE = 52428800

export enum CodeType {
    File,
    JavaFile
}

export interface IPackerOptions {
    // 通过根目录和函数名指定函数路径
    root?: string
    name?: string
    ignore: string | string[]
    incrementalPath?: string
    // 直接指定函数的路径
    functionPath?: string
    codeType: CodeType
}

const TEMPDIR_NAME = '.cloudbase_temp'

/**
 * 将函数代码转换成 Base64 编码
 * 普通文件：Node，PHP
 * Java 文件：Jar，ZIP
 */
export class FunctionPacker {
    // 函数名
    name: string
    // 代码文件类型
    type: CodeType
    funcPath: string
    zipFilePath: string
    // 存放打包文件的临时目录
    tmpPath: string
    // 忽略文件模式
    ignore: string | string[]
    // 指定增量文件路径
    incrementalPath: string
    // 代码类型: Java 和 其他
    codeType: CodeType

    constructor(options: IPackerOptions) {
        const { root, name, codeType, ignore, incrementalPath, functionPath } = options
        this.name = name
        this.ignore = ignore
        this.codeType = codeType
        this.incrementalPath = incrementalPath
        this.funcPath = functionPath ? functionPath : path.resolve(root, name)
        // 每个函数采用不同的文件夹
        this.tmpPath = root
            ? path.join(root, `${TEMPDIR_NAME}_${name}`)
            : path.join(process.cwd(), `${TEMPDIR_NAME}_${name}`)
    }

    async compressFiles() {
        checkFullAccess(this.funcPath, true)
        // 清除原打包文件
        this.clean()
        // 确保目标路径存在
        await makeDir(this.tmpPath)
        // 生成 name.zip 文件
        this.zipFilePath = path.resolve(this.tmpPath, `${this.name}.zip`)

        const zipOption: any = {
            dirPath: this.funcPath,
            outputPath: this.zipFilePath,
            ignore: this.ignore
        }

        if (this.incrementalPath) {
            zipOption.pattern = this.incrementalPath
        }

        await compressToZip(zipOption)
    }

    // 获取 Java 代码
    getJavaFile() {
        const { funcPath } = this
        // funcPath 可能以 .jar 或 .zip 结尾
        const filePath = funcPath.replace(/\.jar$|\.zip$/g, '')
        // Java 代码为 jar 或 zip 包
        const jarExist = checkFullAccess(`${filePath}.jar`)
        const zipExist = checkFullAccess(`${filePath}.zip`)
        if (!jarExist && !zipExist) {
            throw new CloudBaseError('未找到部署函数的 Jar 或者 ZIP 格式文件！')
        }
        this.zipFilePath = jarExist ? `${filePath}.jar` : `${filePath}.zip`
    }

    async build() {
        if (this.codeType === CodeType.JavaFile) {
            try {
                await this.getJavaFile()
            } catch (e) {
                this.clean()
                throw new CloudBaseError(`函数代码打包失败：${e.message}`, {
                    code: e.code
                })
            }
        }

        if (this.codeType === CodeType.File) {
            try {
                await this.compressFiles()
            } catch (e) {
                this.clean()
                throw new CloudBaseError(`函数代码打包失败：${e.message}`, {
                    code: e.code
                })
            }
        }
    }

    // 函数压缩后的代码大于 10M，建议使用 COS 上传（当前暂不支持）
    async isBigFile() {
        if (!this.zipFilePath) {
            await this.build()
        }

        const promiseStat = util.promisify(fs.stat)
        const fileStats = await promiseStat(this.zipFilePath)

        return fileStats.size > BIG_FILE_SIZE
    }

    // API 最大 50MB
    async isReachMaxSize() {
        if (!this.zipFilePath) {
            await this.build()
        }

        const promiseStat = util.promisify(fs.stat)
        const fileStats = await promiseStat(this.zipFilePath)

        return fileStats.size > API_MAX_SIZE
    }

    async getBase64Code() {
        // 将 zip 文件转换成 base64
        const base64 = fs.readFileSync(this.zipFilePath).toString('base64')
        // 非 Java 函数清除打包文件
        if (this.codeType !== CodeType.JavaFile) {
            await this.clean()
        }
        return base64
    }

    async clean(): Promise<void> {
        // allow deleting the current working directory and outside
        this.tmpPath && del.sync([this.tmpPath], { force: true })
        return
    }
}
