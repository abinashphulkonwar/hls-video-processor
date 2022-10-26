//import { createClient } from "@redis/client";
import { Queue, Worker } from "bullmq";
import { cpus } from "os";
import { cpuUsage, memoryUsage } from "process";
import * as dotenv from "dotenv";
import * as path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpgePath from "@ffmpeg-installer/ffmpeg";
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

if (!process.env.PORT) throw new Error("redis env not defiend");
const worker = new Worker(
  "video-prossing",
  path.join(__dirname, "services", "video-worker.js"),
  {
    connection: {
      host: process.env.HOST,
      port: parseInt(process.env.PORT),
      password: process.env.PASSWORD,
      name: process.env.NAME,
    },
    concurrency: 1 || cpus().length,
  }
);

worker.on("completed", (job) => {
  console.log(`${job.id} ${job.data.qux} has completed!`);
});

worker.on("progress", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
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
