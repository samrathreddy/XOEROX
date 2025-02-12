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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDocumentFile = void 0;
var fileUtils_1 = require("../utils/fileUtils");
var ocr_service_1 = require("./ocr.service");
var gpt_service_1 = require("./gpt.service");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var processDocumentFile = function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var fileName, fileBase64, mode, uniqueId, progressCallback, fileType, imagesBase64, activityDir, timestamp, activityFile, pages, i, pageNumber, pageInputText, pageMarkdown, inputTokens, outputTokens, extractedText, gptResult, gptResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fileName = options.fileName, fileBase64 = options.fileBase64, mode = options.mode, uniqueId = options.uniqueId, progressCallback = options.progressCallback;
                fileType = (0, fileUtils_1.detectFileType)(fileName);
                imagesBase64 = [];
                if (!(fileType === "pdf")) return [3 /*break*/, 2];
                progressCallback === null || progressCallback === void 0 ? void 0 : progressCallback("Converting PDF to images...");
                return [4 /*yield*/, (0, fileUtils_1.convertPdfToImages)(fileBase64)];
            case 1:
                imagesBase64 = _a.sent();
                progressCallback === null || progressCallback === void 0 ? void 0 : progressCallback("Converted PDF to ".concat(imagesBase64.length, " images."));
                return [3 /*break*/, 3];
            case 2:
                imagesBase64 = [fileBase64];
                _a.label = 3;
            case 3:
                activityDir = path_1.default.join(__dirname, "../activity-history");
                if (!fs_1.default.existsSync(activityDir)) {
                    fs_1.default.mkdirSync(activityDir, { recursive: true });
                }
                timestamp = new Date().toISOString().replace(/[:.]/g, "-");
                activityFile = path_1.default.join(activityDir, "document-".concat(timestamp, ".json"));
                fs_1.default.writeFileSync(activityFile, JSON.stringify({ fileName: fileName, images: imagesBase64, timestamp: timestamp }, null, 2));
                pages = [];
                i = 0;
                _a.label = 4;
            case 4:
                if (!(i < imagesBase64.length)) return [3 /*break*/, 11];
                pageNumber = i + 1;
                pageInputText = "";
                pageMarkdown = "";
                inputTokens = 0;
                outputTokens = 0;
                progressCallback === null || progressCallback === void 0 ? void 0 : progressCallback("Processing page ".concat(pageNumber, "..."));
                if (!(mode === "ocr")) return [3 /*break*/, 7];
                progressCallback === null || progressCallback === void 0 ? void 0 : progressCallback("Running OCR on page ".concat(pageNumber, "..."));
                return [4 /*yield*/, (0, ocr_service_1.runOcrOnImage)(imagesBase64[i])];
            case 5:
                extractedText = _a.sent();
                pageInputText = extractedText;
                progressCallback === null || progressCallback === void 0 ? void 0 : progressCallback("Processing extracted text with GPT for page ".concat(pageNumber, "..."));
                return [4 /*yield*/, (0, gpt_service_1.runGptOnText)(extractedText)];
            case 6:
                gptResult = _a.sent();
                pageMarkdown = gptResult.markdown;
                inputTokens = gptResult.inputTokens;
                outputTokens = gptResult.outputTokens;
                return [3 /*break*/, 9];
            case 7:
                progressCallback === null || progressCallback === void 0 ? void 0 : progressCallback("Processing page ".concat(pageNumber, " with GPT..."));
                return [4 /*yield*/, (0, gpt_service_1.runGptOnImage)(imagesBase64[i])];
            case 8:
                gptResult = _a.sent();
                pageMarkdown = gptResult.markdown;
                inputTokens = gptResult.inputTokens;
                outputTokens = gptResult.outputTokens;
                _a.label = 9;
            case 9:
                pages.push({ pageNumber: pageNumber, inputText: pageInputText, markdown: pageMarkdown, inputTokens: inputTokens, outputTokens: outputTokens });
                progressCallback === null || progressCallback === void 0 ? void 0 : progressCallback("Completed processing page ".concat(pageNumber, "."));
                _a.label = 10;
            case 10:
                i++;
                return [3 /*break*/, 4];
            case 11:
                progressCallback === null || progressCallback === void 0 ? void 0 : progressCallback("Processing complete.");
                return [2 /*return*/, {
                        fileName: fileName,
                        mode: mode,
                        pages: pages,
                    }];
        }
    });
}); };
exports.processDocumentFile = processDocumentFile;
