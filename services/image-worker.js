"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const s3_1 = require("./s3");
const sharp_1 = __importDefault(require("sharp"));
const process = (data) => {
    return new Promise((resolve, reject) => {
        const fileName = (0, crypto_1.randomUUID)();
        const inputPath = path_1.default.join(__dirname, "..", "image-input", "image.png");
        const { width, height } = data.jobData;
        (0, sharp_1.default)(data.imageData)
            .resize({ width: width, height: height })
            .toBuffer()
            .then((val) => {
            return resolve({ buffer: val });
        })
            .catch((err) => {
            return reject(err);
        });
    });
};
const workerHandler = async (job) => {
    // const data = readFileSync(path.join(__dirname, "..", "./inputs/input.mp4"));
    console.time("start");
    const imageData = await (0, s3_1.getS3Image)({
        bucket: job.data.bucket || "s3",
        key: job.data.key || "s3",
    });
    const { buffer } = await process({ jobData: job.data, imageData: imageData });
    await (0, s3_1.uploadImageTos3)(buffer);
    console.timeEnd("start");
};
exports.default = workerHandler;
