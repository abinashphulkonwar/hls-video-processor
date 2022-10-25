import { createClient } from "@redis/client";
import { Queue, Worker } from "bullmq";
import { cpus } from "os";
import { cpuUsage, memoryUsage } from "process";
import * as path from "path";

const __dirname = path.resolve();
const workerHandler = path.join(__dirname, "services", "video-worker.js");
console.log(workerHandler);
console.log(cpuUsage(), memoryUsage());

const client = createClient({
  url: process.env.REDIS_URL,
});

const worker = new Worker("video-prossing", workerHandler, {
  connection: {
    host: "redis-16150.c301.ap-south-1-1.ec2.cloud.redislabs.com",
    port: 16150,
    password: "Gb2gQSOuszQIMVzfweqelKmMzlfLwtVv",
    name: "default",
  },
  concurrency: cpus().length,
});

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("progress", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

client.on("error", (err) => console.log("Redis Client Error", err));
client
  .connect()
  .then(() => {
    client.subscribe("video-prossing", (data, event) => {
      console.log(data, event);
    });
  })
  .catch((e) => {
    console.log(e);
  });
