import { SandboxedJob } from "bullmq";
import { mkdir, mkdirSync, readdirSync, writeFileSync } from "fs";
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

enum qualityEnum {
  "1280x720" = "1280x720",
  "640x360" = "640x360",
}
enum qualityFileName {
  "1280x720" = "720_index",
  "640x360" = "360_index",
}
const process = (data: any, quality: qualityEnum, fileName = "") => {
  return new Promise<fileInterface>((resolve, reject) => {
    const folderPath = path.join(__dirname, "..", "output", fileName, quality);
    if (!existsSync(fileName)) {
      mkdirSync(folderPath);
    }
    let indexFile: string = "index";
    if (quality == qualityEnum["640x360"])
      indexFile = qualityFileName["640x360"];
    if (quality == qualityEnum["1280x720"])
      indexFile = qualityFileName["1280x720"];

    Ffmpeg(path.join(__dirname, "..", "./inputs/input.mp4"))
      .outputOptions([
        "-profile:v baseline",
        "-level 3.0",
        `-s ${quality}`,
        "-r 30",
        "-start_number 0",
        "-hls_time 10",
        "-hls_list_size 0",
        "-f hls",
      ])
      .output(`output/${fileName}/${quality}/${indexFile}.m3u8`)
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

const workerHandler = async (job: SandboxedJob | null) => {
  // const data = readFileSync(path.join(__dirname, "..", "./inputs/input.mp4"));
  console.time("start");
  const fileName = randomUUID();
  const folderPath = path.join(__dirname, "..", "output", fileName);
  if (!existsSync(fileName)) {
    mkdirSync(folderPath);
  }
  const process640x360 = await process(
    job?.data,
    qualityEnum["640x360"],
    fileName
  );
  const process1280x720 = await process(
    job?.data,
    qualityEnum["1280x720"],
    fileName
  );

  writeFileSync(
    folderPath + "/index.m3u8",
    `#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=258157,RESOLUTION=640x360
640x360/360_index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2000000,RESOLUTION=1280x720
1280x720/720_index.m3u8`
  );

  // await uploadVideoTos3({
  //   event: "hls",
  //   job: job.data,
  //   folderPath,
  // });
  console.timeEnd("start");
};
workerHandler(null);

export default workerHandler;
