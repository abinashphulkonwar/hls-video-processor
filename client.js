"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const dotenv = __importStar(require("dotenv")); // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
const types_1 = require("./types");
dotenv.config();
// const client = createClient({
//   url: process.env.REDIS_URL,
// });
if (!process.env.PORT)
    throw new Error("redis env not defiend");
// video-prossing
// image-prossing
const queue = new bullmq_1.Queue(types_1.imageProcess, {
    connection: {
        host: process.env.HOST,
        port: parseInt(process.env.PORT),
        password: process.env.PASSWORD,
        name: process.env.NAME,
    },
});
const every = 1000 * 60 * 15;
const array = [];
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
