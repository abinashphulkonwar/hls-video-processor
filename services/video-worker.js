"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const crypto_1 = require("crypto");
const process = () => {
    return new Promise((resolve, reject) => {
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
            .output(`output/${(0, crypto_1.randomUUID)()}.m3u8`)
            .on("progress", function (progress) {
            console.log("Processing: " + progress.percent + "% done");
        })
            .on("end", function (err, stdout, stderr) {
            console.log("Finished processing!" /*, err, stdout, stderr*/);
            return resolve("hiiiii");
        })
            .on("error", (err) => {
            return reject(err);
        })
            .run();
    });
};
const workerHandler = async (job) => {
    // const data = readFileSync(path.join(__dirname, "..", "./inputs/input.mp4"));
    await process();
    console.log("hls", job.data);
};
exports.default = workerHandler;
