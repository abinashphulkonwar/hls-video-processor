//import { createClient } from "@redis/client";
import { randomUUID } from "crypto";
import { Queue } from "bullmq";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { imageProcess, videoProcess } from "./types";
dotenv.config();

// const client = createClient({
//   url: process.env.REDIS_URL,
// });
if (!process.env.PORT) throw new Error("redis env not defiend");
// video-prossing
// image-prossing

const queue = new Queue(imageProcess, {
  connection: {
    host: process.env.HOST,
    port: parseInt(process.env.PORT),
    password: process.env.PASSWORD,
    name: process.env.NAME,
  },
});

const every = 1000 * 60 * 15;
const array: {
  data: { qux: number; id: string; width: number; height: number };
  name: string;
  opts: object;
}[] = [];
for (let i = 0; i < 10; i++) {
  array.push({
    data: { qux: i, id: "id", width: 200, height: 200 },
    name: "hls",
    opts: {
      removeOnComplete: true,
      removeOnFail: true,
      repeat: {
        every: every,
        limit: 5,
      },
    },
  });
}

queue
  .addBulk(array)
  .then(() => {
    return queue.count();
  })
  .then((data) => {
    console.log(data);
    queue.disconnect();
  });
queue.on("error", (err) => {
  console.log(err);
});

// queue
//   .add(
//     "hls",
//     { qux: "jdsbjhbsdjbs sjhdbjhbsdjbjh", id: "id" },
//     {
//       removeOnComplete: true,
//       removeOnFail: true,
//       repeat: {
//         every: every,
//         limit: 5,
//       },
//       delay: 1000,
//     }
//   )
//   .then(() => queue.disconnect());
// queue.on("error", (err) => {
//   console.log(err);
// });

// client.on("error", (err) => console.log("Redis Client Error", err));
// client
//   .connect()
//   .then(async () => {
//     await client.publish(
//       "video-prossing",
//       JSON.stringify({
//         id: randomUUID(),
//         key: randomUUID(),
//         url: randomUUID(),
//       })
//     );
//   })
//   .finally(() => {
//     client.disconnect();
//   })
//   .catch((e) => {
//     console.log(e);
//   });
