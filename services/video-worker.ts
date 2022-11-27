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
  "480x240" = "480x240",
  "1280x720" = "1280x720",
  "640x360" = "640x360",
}

enum qualityFileName {
  "1280x720" = "720_index",
  "640x360" = "360_index",
  "480x240" = "240_index",
}

const process = (
  data: any,
  quality: qualityEnum,
  fileName: string = "",
  bitrate: string = "8M",
  duration: number = 10
) => {
  return new Promise<fileInterface>((resolve, reject) => {
    const folderPath = path.join(__dirname, "..", "output", fileName, quality);

    if (!existsSync(fileName)) {
      mkdirSync(folderPath);
    }

    let indexFile: string = "index";

    // if (quality == qualityEnum["640x360"])
    //   indexFile = qualityFileName["640x360"];

    // if (quality == qualityEnum["1280x720"])
    //   indexFile = qualityFileName["1280x720"];

    Ffmpeg(path.join(__dirname, "..", "./inputs/20221002_203427.mp4"))
      .outputOptions([
        "-profile:v baseline",
        "-level 3.0",
        `-s ${quality}`,
        "-r 30",
        `-b:v ${bitrate}`,
        "-start_number 0",
        `-hls_time ${duration}`,
        "-hls_list_size 0",
        "-filter:v fps=30",
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
    fileName,
    "1.5M",
    5
  );

  const process480x240 = await process(
    job?.data,
    qualityEnum["480x240"],
    fileName,
    "1M",
    5
  );

  const process1280x720 = await process(
    job?.data,
    qualityEnum["1280x720"],
    fileName,
    "5M",
    10
  );

  writeFileSync(
    folderPath + "/index.m3u8",
    `#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=258157,RESOLUTION=480x240
480x240/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=858157,RESOLUTION=640x360
640x360/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2000000,RESOLUTION=1280x720
1280x720/index.m3u8`
  );

  await uploadVideoTos3({
    event: "hls",
    job: job?.data,
    folderPath: process640x360,
  });

  await uploadVideoTos3({
    event: "hls",
    job: job?.data,
    folderPath: process1280x720,
  });
  console.timeEnd("start");
};

workerHandler(null);

export default workerHandler;
