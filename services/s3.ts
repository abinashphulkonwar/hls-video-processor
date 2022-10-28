import { randomUUID } from "crypto";
import { readFileSync, unlink, promises, readSync, writeFileSync } from "fs";
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
  //console.log(data);

  writeFileSync(
    path.join(__dirname, "..", "image-output", `${randomUUID()}.jpg`),
    data
  );
};

const getS3Image = async (data: getImageS3Interface): Promise<Buffer> => {
  if (!data.bucket && !data.key) throw new Error("buckte and key not found");

  const buffer = readFileSync(
    path.join(
      __dirname,
      "..",
      "image-input",
      "hayley-murray-nRz09nr26nM-unsplash.jpg"
    )
  );
  return buffer;
};

export { uploadVideoTos3, uploadImageTos3, getS3Image };
