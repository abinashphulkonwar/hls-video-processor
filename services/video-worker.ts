import { SandboxedJob } from "bullmq";

const workerHandler = async (job: SandboxedJob) => {
  if (job.data.id === "id") {
    console.log(job.data.id);
    throw new Error("No valid job");
  }
  if (job?.name == "video") throw new Error("No valid job");
  console.log(job.data);
};
export default workerHandler;
