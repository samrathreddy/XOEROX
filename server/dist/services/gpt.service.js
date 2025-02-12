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
exports.runGptOnImage = exports.convertKeysToSnakeCase = exports.runGptOnText = void 0;
var openai_1 = require("openai");
var env_1 = __importDefault(require("../config/env"));
var axios_1 = __importDefault(require("axios"));
var sharp_1 = __importDefault(require("sharp"));
// Create OpenAI config
var configuration = new openai_1.Configuration({
    apiKey: env_1.default.gptApiKey
});
var openai = new openai_1.OpenAIApi(configuration);
/**
 * runGptOnText
 * @param text The text content to be turned into Markdown
 */
var runGptOnText = function (text) { return __awaiter(void 0, void 0, void 0, function () {
    var messages, response, content, usage, inputTokens, outputTokens, err_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                messages = [
                    {
                        role: 'system',
                        content: "You are a helpful assistant that converts text to structured Markdown. Avoid ```markdown tags in the response."
                    },
                    {
                        role: 'user',
                        content: "Convert the following text to well-structured Markdown, preserving formatting where possible:\n\n".concat(text)
                    },
                ];
                return [4 /*yield*/, openai.createChatCompletion({
                        model: 'gpt-4o-mini',
                        messages: messages
                    })];
            case 1:
                response = _c.sent();
                content = ((_b = (_a = response.data.choices) === null || _a === void 0 ? void 0 : _a[0].message) === null || _b === void 0 ? void 0 : _b.content) || '';
                usage = response.data.usage;
                inputTokens = (usage === null || usage === void 0 ? void 0 : usage.prompt_tokens) || 0;
                outputTokens = (usage === null || usage === void 0 ? void 0 : usage.completion_tokens) || 0;
                return [2 /*return*/, {
                        markdown: content,
                        inputTokens: inputTokens,
                        outputTokens: outputTokens
                    }];
            case 2:
                err_1 = _c.sent();
                console.error("GPT error:", err_1);
                return [2 /*return*/, {
                        markdown: "(GPT error)",
                        inputTokens: 0,
                        outputTokens: 0
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.runGptOnText = runGptOnText;
var compressImage = function (imageBase64) { return __awaiter(void 0, void 0, void 0, function () {
    var buffer, compressedBuffer, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                buffer = Buffer.from(imageBase64.split(";base64,").pop(), "base64");
                return [4 /*yield*/, (0, sharp_1.default)(buffer)
                        .resize(1024, 1024, { fit: "inside" }) // Resize to within 1024x1024
                        .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
                        .toBuffer()];
            case 1:
                compressedBuffer = _a.sent();
                return [2 /*return*/, "data:image/jpeg;base64,".concat(compressedBuffer.toString("base64"))];
            case 2:
                error_1 = _a.sent();
                console.error("Error compressing image:", error_1);
                return [2 /*return*/, imageBase64]; // Fallback to original if compression fails
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Send Image to GPT-4o for Processing
 */
var convertKeysToSnakeCase = function (obj) {
    if (Array.isArray(obj)) {
        return obj.map(function (item) { return (0, exports.convertKeysToSnakeCase)(item); });
    }
    else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce(function (acc, key) {
            var snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
            acc[snakeKey] = (0, exports.convertKeysToSnakeCase)(obj[key]);
            return acc;
        }, {});
    }
    return obj;
};
exports.convertKeysToSnakeCase = convertKeysToSnakeCase;
var runGptOnImage = function (imageBase64) { return __awaiter(void 0, void 0, void 0, function () {
    var compressedImage, requestBody, response, data, err_2;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 3, , 4]);
                return [4 /*yield*/, compressImage(imageBase64)];
            case 1:
                compressedImage = _f.sent();
                requestBody = (0, exports.convertKeysToSnakeCase)({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "You are an AI that extracts text and formats structured Markdown from images. Directly extract and provide the markdown, do not include any other text or commentary. Don't assume an your own. Cover the whole image content. If there is a strike text, dont include it. If there is a signatured already alreay provide as [signature], only provide where the signatures are signed already but not left blank. Avoid ```markdown tags in the response. Make sure to include all the text from the image in the markdown and retain the styling of the text from the image provided. At top or bottom of the image there can be a pages number or chapter name or number handle even it properly. Don't break the markdown formatting. Extract insights from graphs by identifying key points and their corresponding values on the x-axis. Include these insights in the markdown text. Do not include any images of the graphs. If there are table take time and use table markdown and handle it properly." },
                        { role: "user", content: [{ type: "image_url", image_url: { url: compressedImage } }] },
                    ],
                    maxTokens: 4024, // ✅ Converted to `max_tokens` automatically
                });
                return [4 /*yield*/, axios_1.default.post("https://api.openai.com/v1/chat/completions", requestBody, {
                        headers: {
                            Authorization: "Bearer ".concat(env_1.default.gptApiKey),
                            "Content-Type": "application/json",
                        },
                    })];
            case 2:
                response = _f.sent();
                data = response.data;
                return [2 /*return*/, {
                        markdown: ((_c = (_b = (_a = data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) || "(No response from GPT)",
                        inputTokens: ((_d = data.usage) === null || _d === void 0 ? void 0 : _d.prompt_tokens) || 0,
                        outputTokens: ((_e = data.usage) === null || _e === void 0 ? void 0 : _e.completion_tokens) || 0,
                    }];
            case 3:
                err_2 = _f.sent();
                console.error("Error in OpenAI completion:", err_2);
                return [2 /*return*/, {
                        markdown: "(GPT error)",
                        inputTokens: 0,
                        outputTokens: 0,
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.runGptOnImage = runGptOnImage;
