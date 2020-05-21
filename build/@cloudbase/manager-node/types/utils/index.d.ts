export { guid6 } from './uuid';
export * from './cloud-api-request';
export * from './auth';
export * from './cloudbase-request';
export * from './http-request';
export * from './envLazy';
export * from './fs';
interface IZipOption {
    dirPath: string;
    outputPath: string;
    ignore?: string | string[];
    pattern?: string;
}
export declare function compressToZip(option: IZipOption): Promise<unknown>;
export declare function getRuntime(): string;
export declare function getEnvVar(envName: string): string;
export declare function rsaEncrypt(data: string): string;
export declare function sleep(time: number): Promise<void>;
