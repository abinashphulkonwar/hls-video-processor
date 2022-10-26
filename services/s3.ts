import { readFileSync } from "fs";
import path from "path";

interface hlsInterface {
  event: string;
  job: object;
  folderPath: { fileName: string; fileNames: string[]; folderPath: string };
}

const uploadTos3 = async ({ event, job, folderPath }: hlsInterface) => {
  console.log(event, job, folderPath);
  for await (const val of folderPath.fileNames) {
    const currentUploadPath = path.join(folderPath.folderPath, val);
    console.log(currentUploadPath);
    const data = readFileSync(currentUploadPath);
  }
};

export { uploadTos3 };
