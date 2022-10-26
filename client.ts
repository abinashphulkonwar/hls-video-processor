//import { createClient } from "@redis/client";
import { randomUUID } from "crypto";
import { Queue } from "bullmq";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

// const client = createClient({
//   url: process.env.REDIS_URL,
// });
if (!process.env.PORT) throw new Error("redis env not defiend");
const queue = new Queue("video-prossing", {
  connection: {
    host: process.env.HOST,
    port: parseInt(process.env.PORT),
    password: process.env.PASSWORD,
    name: process.env.NAME,
  },
});

const every = 1000 * 60 * 15;
const array: {
  data: { qux: number; id: string };
  name: string;
  opts: object;
}[] = [];
for (let i = 0; i < 1; i++) {
  array.push({
    data: { qux: i, id: "id" },
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

queue.addBulk(array).then(() => queue.disconnect());
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
