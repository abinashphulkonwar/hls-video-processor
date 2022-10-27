import { readFileSync, unlink, promises } from "fs";
import path from "path";

interface hlsInterface {
  event: string;
  job: object;
  folderPath: { fileName: string; fileNames: string[]; folderPath: string };
}

interface getImageS3Interface {
  bucket: string;
  key: string;
}

const uploadVideoTos3 = async ({ event, job, folderPath }: hlsInterface) => {
  console.log(event, job, folderPath);
  for await (const val of folderPath.fileNames) {
    const currentUploadPath = path.join(folderPath.folderPath, val);
    console.log(currentUploadPath);
    const data = readFileSync(currentUploadPath);
    await promises.unlink(currentUploadPath);
  }
  await promises.rmdir(folderPath.folderPath);
};
const uploadImageTos3 = async (data: Buffer) => {
  console.log(data);
};

const getS3Image = async (data: getImageS3Interface): Promise<Buffer> => {
  if (!data.bucket && !data.key) throw new Error("buckte and key not found");

  return Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
};

export { uploadVideoTos3, uploadImageTos3, getS3Image };
