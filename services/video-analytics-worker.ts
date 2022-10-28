import { SandboxedJob } from "bullmq";

const workerHandler = async (job: SandboxedJob) => {
  // const data = readFileSync(path.join(__dirname, "..", "./inputs/input.mp4"));
  console.time("start");

  console.timeEnd("start");
};
export default workerHandler;
