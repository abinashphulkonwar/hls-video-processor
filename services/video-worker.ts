import { SandboxedJob } from "bullmq";
import { readFileSync } from "fs";
import path from "path";
import Ffmpeg from "fluent-ffmpeg";
import { randomUUID } from "crypto";

const process = () => {
  return new Promise((resolve, reject) => {
    Ffmpeg(path.join(__dirname, "..", "./inputs/input.mp4"))
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
      .output(`output/${randomUUID()}.m3u8`)
      .on("progress", function (progress: any) {
        console.log("Processing: " + progress.percent + "% done");
      })
      .on("end", function (err: Error, stdout: any, stderr: any) {
        console.log("Finished processing!" /*, err, stdout, stderr*/);
        return resolve("hiiiii");
      })
      .on("error", (err) => {
        return reject(err);
      })
      .run();
  });
};

const workerHandler = async (job: SandboxedJob) => {
  // const data = readFileSync(path.join(__dirname, "..", "./inputs/input.mp4"));
  await process();
  console.log("hls", job.data);
};
export default workerHandler;
