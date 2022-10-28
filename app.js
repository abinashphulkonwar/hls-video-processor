"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import { createClient } from "@redis/client";
const bullmq_1 = require("bullmq");
const os_1 = require("os");
const process_1 = require("process");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const types_1 = require("./types");
dotenv.config();
//ffmpeg.setFfmpegPath(ffmpgePath.path);
fluent_ffmpeg_1.default.getAvailableCodecs((e, data) => {
    let length = 0;
    for (const val in data) {
        length++;
    }
    console.log(length, "codec");
});
fluent_ffmpeg_1.default.getAvailableFilters((e, data) => {
    let length = 0;
    for (const val in data) {
        length++;
    }
    console.log(length, "filters");
});
console.log((0, process_1.cpuUsage)(), (0, process_1.memoryUsage)());
// const client = createClient({
//   url: process.env.REDIS_URL,
// });
if (!process.env.PORT)
    throw new Error("redis port not defiend");
if (!process.env.HOST)
    throw new Error("redis host not defiend");
if (!process.env.PASSWORD)
    throw new Error("redis password not defiend");
if (!process.env.NAME)
    throw new Error("redis name not defiend");
const connection = {
    host: process.env.HOST,
    port: parseInt(process.env.PORT),
    password: process.env.PASSWORD,
    name: process.env.NAME,
};
const worker = new bullmq_1.Worker(types_1.videoProcess, path.join(__dirname, "services", "video-worker.js"), {
    connection,
    concurrency: 2 || (0, os_1.cpus)().length,
});
const workerImage = new bullmq_1.Worker(types_1.imageProcess, path.join(__dirname, "services", "image-worker.js"), {
    connection,
    concurrency: 4 || (0, os_1.cpus)().length,
});
worker.on("completed", (job) => {
    console.log(`${job.id} ${job.data.qux} has completed!`);
});
workerImage.on("completed", (job) => {
    console.log(`${job.id} ${job.data.qux} has completed!`);
});
worker.on("progress", (job) => {
    console.log(`${job.id} has completed!`);
});
worker.on("failed", (job, err) => {
    console.log(`${job === null || job === void 0 ? void 0 : job.id} has failed with ${err.message}`);
});
workerImage.on("failed", (job, err) => {
    console.log(`${job === null || job === void 0 ? void 0 : job.id} has failed with ${err.message}`);
});
worker.on("active", (job, err) => {
    console.log(`${job.id} has started!`);
});
// client.on("error", (err) => console.log("Redis Client Error", err));
// client
//   .connect()
//   .then(() => {
//     client.subscribe("video-prossing", (data, event) => {
//       console.log(data, event);
//     });
//   })
//   .catch((e) => {
//     console.log(e);
//   });
