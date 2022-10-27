import { SandboxedJob } from "bullmq";
import { mkdir, mkdirSync, readdirSync } from "fs";
import path from "path";
import Ffmpeg from "fluent-ffmpeg";
import { randomUUID } from "crypto";
import { existsSync } from "fs";
import { uploadVideoTos3 } from "./s3";

interface fileInterface {
  fileName: string;
  fileNames: string[];
  folderPath: string;
}

const process = (data: any) => {
  return new Promise<fileInterface>((resolve, reject) => {
    const fileName = randomUUID();
    const folderPath = path.join(__dirname, "..", "output", fileName);
    if (!existsSync(fileName)) {
      mkdirSync(folderPath);
    }

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
      .output(`output/${fileName}/${fileName}.m3u8`)
      .on("progress", function (progress: any) {
        console.log("Processing: " + progress.percent + "% done");
      })
      .on("end", function (err: Error, stdout: any, stderr: any) {
        const fileNames = readdirSync(folderPath);
        return resolve({ fileName, fileNames, folderPath });
      })
      .on("error", (err) => {
        return reject(err);
      })
      .run();
  });
};

const workerHandler = async (job: SandboxedJob) => {
  // const data = readFileSync(path.join(__dirname, "..", "./inputs/input.mp4"));

  const folderPath = await process(job.data);
  await uploadVideoTos3({
    event: "hls",
    job: job.data,
    folderPath,
  });
};
export default workerHandler;
