//import { createClient } from "@redis/client";
import { Queue, Worker } from "bullmq";
import { cpus } from "os";
import { cpuUsage, memoryUsage } from "process";
import * as dotenv from "dotenv";
import * as path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpgePath from "@ffmpeg-installer/ffmpeg";
import { imageProcess, videoProcess } from "./types";
dotenv.config();

//ffmpeg.setFfmpegPath(ffmpgePath.path);

ffmpeg.getAvailableCodecs((e, data) => {
  let length = 0;
  for (const val in data) {
    length++;
  }
  console.log(length, "codec");
});
ffmpeg.getAvailableFilters((e, data) => {
  let length = 0;
  for (const val in data) {
    length++;
  }
  console.log(length, "filters");
});
console.log(cpuUsage(), memoryUsage());

// const client = createClient({
//   url: process.env.REDIS_URL,
// });

if (!process.env.PORT) throw new Error("redis port not defiend");
if (!process.env.HOST) throw new Error("redis host not defiend");
if (!process.env.PASSWORD) throw new Error("redis password not defiend");
if (!process.env.NAME) throw new Error("redis name not defiend");

const connection = {
  host: process.env.HOST,
  port: parseInt(process.env.PORT),
  password: process.env.PASSWORD,
  name: process.env.NAME,
};

const worker = new Worker(
  videoProcess,
  path.join(__dirname, "services", "video-worker.js"),
  {
    connection,
    concurrency: 2 || cpus().length,
  }
);
const workerImage = new Worker(
  imageProcess,
  path.join(__dirname, "services", "image-worker.js"),
  {
    connection,
    concurrency: 4 || cpus().length,
  }
);

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
  console.log(`${job?.id} has failed with ${err.message}`);
});
workerImage.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
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
