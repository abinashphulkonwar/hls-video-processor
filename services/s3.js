"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadTos3 = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const uploadTos3 = async ({ event, job, folderPath }) => {
    console.log(event, job, folderPath);
    for await (const val of folderPath.fileNames) {
        const currentUploadPath = path_1.default.join(folderPath.folderPath, val);
        console.log(currentUploadPath);
        const data = (0, fs_1.readFileSync)(currentUploadPath);
    }
};
exports.uploadTos3 = uploadTos3;
