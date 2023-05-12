"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
exports.getS3Image = exports.uploadImageTos3 = exports.uploadVideoTos3 = void 0;
var crypto_1 = require("crypto");
var fs_1 = require("fs");
var path_1 = require("path");
var uploadVideoTos3 = function (_a) {
    var event = _a.event, job = _a.job, folderPath = _a.folderPath;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, _c, val, currentUploadPath, data, e_1_1;
        var e_1, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 5, 6, 11]);
                    _b = __asyncValues(folderPath.fileNames);
                    _e.label = 1;
                case 1: return [4 /*yield*/, _b.next()];
                case 2:
                    if (!(_c = _e.sent(), !_c.done)) return [3 /*break*/, 4];
                    val = _c.value;
                    currentUploadPath = path_1["default"].join(folderPath.folderPath, val);
                    data = (0, fs_1.readFileSync)(currentUploadPath);
                    _e.label = 3;
                case 3: return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 11];
                case 5:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 11];
                case 6:
                    _e.trys.push([6, , 9, 10]);
                    if (!(_c && !_c.done && (_d = _b["return"]))) return [3 /*break*/, 8];
                    return [4 /*yield*/, _d.call(_b)];
                case 7:
                    _e.sent();
                    _e.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 10: return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
};
exports.uploadVideoTos3 = uploadVideoTos3;
var uploadImageTos3 = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        //console.log(data);
        (0, fs_1.writeFileSync)(path_1["default"].join(__dirname, "..", "image-output", "".concat((0, crypto_1.randomUUID)(), ".jpg")), data);
        return [2 /*return*/];
    });
}); };
exports.uploadImageTos3 = uploadImageTos3;
var getS3Image = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var buffer;
    return __generator(this, function (_a) {
        if (!data.bucket && !data.key)
            throw new Error("buckte and key not found");
        buffer = (0, fs_1.readFileSync)(path_1["default"].join(__dirname, "..", "image-input", "hayley-murray-nRz09nr26nM-unsplash.jpg"));
        return [2 /*return*/, buffer];
    });
}); };
exports.getS3Image = getS3Image;
