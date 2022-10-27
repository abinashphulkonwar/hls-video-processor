import { SandboxedJob } from "bullmq";
import { mkdir, mkdirSync, readdirSync } from "fs";
import path from "path";
import Ffmpeg from "fluent-ffmpeg";
import { randomUUID } from "crypto";
import { existsSync } from "fs";
import { getS3Image, uploadImageTos3 } from "./s3";
import sharp from "sharp";
interface fileInterface {
  buffer: Buffer;
}

interface processInterface {
  jobData: any;
  imageData: Buffer;
}

const process = (data: processInterface) => {
  return new Promise<fileInterface>((resolve, reject) => {
    const fileName = randomUUID();
    const inputPath = path.join(__dirname, "..", "image-input", "image.png");
    const { width, height } = data.jobData;
    sharp(data.imageData)
      .resize({ width: width, height: height })
      .toBuffer()
      .then((val) => {
        return resolve({ buffer: val });
      })
      .catch((err: Error) => {
        return reject(err);
      });
  });
};

const workerHandler = async (job: SandboxedJob) => {
  // const data = readFileSync(path.join(__dirname, "..", "./inputs/input.mp4"));
  const imageData = await getS3Image({
    bucket: job.data.bucket,
    key: job.data.key,
  });
  const { buffer } = await process({ jobData: job.data, imageData: imageData });
  await uploadImageTos3(buffer);
};
export default workerHandler;
