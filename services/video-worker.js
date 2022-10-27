"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const crypto_1 = require("crypto");
const fs_2 = require("fs");
const s3_1 = require("./s3");
const process = (data) => {
    return new Promise((resolve, reject) => {
        const fileName = (0, crypto_1.randomUUID)();
        const folderPath = path_1.default.join(__dirname, "..", "output", fileName);
        if (!(0, fs_2.existsSync)(fileName)) {
            (0, fs_1.mkdirSync)(folderPath);
        }
        (0, fluent_ffmpeg_1.default)(path_1.default.join(__dirname, "..", "./inputs/input.mp4"))
            .outputOptions([
            "-profile:v baseline",
            "-level 3.0",
            "-s 854x480",
            "-r 30",
            "-start_number 0",
            "-hls_time 10",
            "-hls_list_size 0",
            "-f hls",
        ])
            .output(`output/${fileName}/${fileName}.m3u8`)
            .on("progress", function (progress) {
            console.log("Processing: " + progress.percent + "% done");
        })
            .on("end", function (err, stdout, stderr) {
            const fileNames = (0, fs_1.readdirSync)(folderPath);
            return resolve({ fileName, fileNames, folderPath });
        })
            .on("error", (err) => {
            return reject(err);
        })
            .run();
    });
};
const workerHandler = async (job) => {
    // const data = readFileSync(path.join(__dirname, "..", "./inputs/input.mp4"));
    const folderPath = await process(job.data);
    await (0, s3_1.uploadVideoTos3)({
        event: "hls",
        job: job.data,
        folderPath,
    });
};
exports.default = workerHandler;
