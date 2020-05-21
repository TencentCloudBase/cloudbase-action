"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const error_1 = require("../error");
const del_1 = __importDefault(require("del"));
// 检查路径是否可以访问（读、写）
function checkFullAccess(dest, throwError = false) {
    try {
        // 可见、可写
        fs_1.default.accessSync(dest, fs_1.default.constants.F_OK);
        fs_1.default.accessSync(dest, fs_1.default.constants.W_OK);
        fs_1.default.accessSync(dest, fs_1.default.constants.R_OK);
        return true;
    }
    catch (e) {
        if (throwError) {
            throw new error_1.CloudBaseError(`路径不存在或无读写权限：${dest}`);
        }
        else {
            return false;
        }
    }
}
exports.checkFullAccess = checkFullAccess;
// 检查路径是否可以写
function checkReadable(dest, throwError = false) {
    try {
        // 可见、可读
        fs_1.default.accessSync(dest, fs_1.default.constants.F_OK);
        fs_1.default.accessSync(dest, fs_1.default.constants.R_OK);
        return true;
    }
    catch (e) {
        if (throwError) {
            throw new error_1.CloudBaseError(`路径不存在或无读权限：${dest}`);
        }
        else {
            return false;
        }
    }
}
exports.checkReadable = checkReadable;
function isDirectory(dest) {
    checkFullAccess(dest, true);
    return fs_1.default.statSync(dest).isDirectory();
}
exports.isDirectory = isDirectory;
function formateFileSize(size, unit) {
    const unitMap = {
        KB: 1024,
        MB: Math.pow(1024, 2),
        GB: Math.pow(1024, 3)
    };
    return Number(size / unitMap[unit]).toFixed(2);
}
exports.formateFileSize = formateFileSize;
function delSync(patterns) {
    del_1.default.sync(patterns, { force: true });
}
exports.delSync = delSync;
