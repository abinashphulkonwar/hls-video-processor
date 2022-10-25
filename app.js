"use strict";
exports.__esModule = true;
var client_1 = require("@redis/client");
var bullmq_1 = require("bullmq");
var os_1 = require("os");
var process_1 = require("process");
var path = require("path");
var __dirname = path.resolve();
var workerHandler = path.join(__dirname, "services", "video-worker.js");
console.log(workerHandler);
console.log((0, process_1.cpuUsage)(), (0, process_1.memoryUsage)());
var client = (0, client_1.createClient)({
    url: "redis://default:Gb2gQSOuszQIMVzfweqelKmMzlfLwtVv@redis-16150.c301.ap-south-1-1.ec2.cloud.redislabs.com:16150"
});
var worker = new bullmq_1.Worker("video-prossing", workerHandler, {
    connection: {
        host: "redis-16150.c301.ap-south-1-1.ec2.cloud.redislabs.com",
        port: 16150,
        password: "Gb2gQSOuszQIMVzfweqelKmMzlfLwtVv",
        name: "default"
    },
    concurrency: (0, os_1.cpus)().length
});
worker.on("completed", function (job) {
    console.log("".concat(job.id, " has completed!"));
});
worker.on("progress", function (job) {
    console.log("".concat(job.id, " has completed!"));
});
worker.on("failed", function (job, err) {
    console.log("".concat(job.id, " has failed with ").concat(err.message));
});
client.on("error", function (err) { return console.log("Redis Client Error", err); });
client
    .connect()
    .then(function () {
    client.subscribe("video-prossing", function (data, event) {
        console.log(data, event);
    });
})["catch"](function (e) {
    console.log(e);
});
