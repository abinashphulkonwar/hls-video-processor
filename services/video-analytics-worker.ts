import { SandboxedJob } from "bullmq";
import { getrecogation } from "./rekagoniation";

const workerHandler = async (job: SandboxedJob) => {
  // const data = readFileSync(path.join(__dirname, "..", "./inputs/input.mp4"));
  console.time("start");
  getrecogation();
  console.timeEnd("start");
};
export default workerHandler;
