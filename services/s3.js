"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getS3Image = exports.uploadImageTos3 = exports.uploadVideoTos3 = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const uploadVideoTos3 = async ({ event, job, folderPath }) => {
    console.log(event, job, folderPath);
    for await (const val of folderPath.fileNames) {
        const currentUploadPath = path_1.default.join(folderPath.folderPath, val);
        console.log(currentUploadPath);
        const data = (0, fs_1.readFileSync)(currentUploadPath);
        await fs_1.promises.unlink(currentUploadPath);
    }
    await fs_1.promises.rmdir(folderPath.folderPath);
};
exports.uploadVideoTos3 = uploadVideoTos3;
const uploadImageTos3 = async (data) => {
    console.log(data);
};
exports.uploadImageTos3 = uploadImageTos3;
const getS3Image = async (data) => {
    if (!data.bucket && !data.key)
        throw new Error("buckte and key not found");
    return Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
};
exports.getS3Image = getS3Image;
