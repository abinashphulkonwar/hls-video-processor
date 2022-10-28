"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rekagoniation_1 = require("./rekagoniation");
const workerHandler = async (job) => {
    // const data = readFileSync(path.join(__dirname, "..", "./inputs/input.mp4"));
    console.time("start");
    (0, rekagoniation_1.getrecogation)();
    console.timeEnd("start");
};
exports.default = workerHandler;
