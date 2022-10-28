"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getS3Image = exports.uploadImageTos3 = exports.uploadVideoTos3 = void 0;
const crypto_1 = require("crypto");
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
    //console.log(data);
    (0, fs_1.writeFileSync)(path_1.default.join(__dirname, "..", "image-output", `${(0, crypto_1.randomUUID)()}.jpg`), data);
};
exports.uploadImageTos3 = uploadImageTos3;
const getS3Image = async (data) => {
    if (!data.bucket && !data.key)
        throw new Error("buckte and key not found");
    const buffer = (0, fs_1.readFileSync)(path_1.default.join(__dirname, "..", "image-input", "hayley-murray-nRz09nr26nM-unsplash.jpg"));
    return buffer;
};
exports.getS3Image = getS3Image;
