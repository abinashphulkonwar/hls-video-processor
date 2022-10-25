import { createClient } from "@redis/client";
import { randomUUID } from "crypto";
import { Queue } from "bullmq";

const client = createClient({
  url: process.env.REDIS_URL,
});
if (!process.env.PORT) throw new Error("redis env not defiend");
const queue = new Queue("video-prossing", {
  connection: {
    host: process.env.HOST,
    port: parseInt(process.env.PORT),
    password: process.env.PASSWORD,
    name: process.env.NAME,
  },
});

const every = 1000 * 5;
queue
  .add(
    "hls",
    { qux: "idvhjvjhbjhbhj", id: "id" },
    {
      removeOnComplete: true,
      removeOnFail: true,
      repeat: {
        every: every,
        limit: 5,
      },
      delay: 10000,
    }
  )
  .then(() => queue.disconnect());
queue.on("error", (err) => {
  console.log(err);
});

client.on("error", (err) => console.log("Redis Client Error", err));
client
  .connect()
  .then(async () => {
    await client.publish(
      "video-prossing",
      JSON.stringify({
        id: randomUUID(),
        key: randomUUID(),
        url: randomUUID(),
      })
    );
  })
  .finally(() => {
    client.disconnect();
  })
  .catch((e) => {
    console.log(e);
  });
