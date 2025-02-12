"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.receiveUpdate = exports.getDocumentStatus = exports.ingestDocument = void 0;
var uuid_1 = require("uuid"); // Import uuid for unique ID generation
var document_service_1 = require("../services/document.service");
var axios_1 = __importDefault(require("axios")); // ✅ Use axios to send updates as new requests
var env_1 = __importDefault(require("../config/env"));
// ✅ Temporary in-memory store to track status
var processingStatus = {};
/**
 * Handle document ingestion with external update requests
 */
var ingestDocument = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mode, file, fileBase64, fileName, uniqueId_1;
    return __generator(this, function (_a) {
        try {
            console.log("Received form data:", req.body);
            mode = req.body.mode.toLowerCase();
            file = req.file;
            if (!file) {
                return [2 /*return*/, res.status(400).json({ error: "File is required" })];
            }
            fileBase64 = "data:".concat(file.mimetype, ";base64,").concat(file.buffer.toString("base64"));
            fileName = file.originalname;
            console.log("Processing file:", fileName, "Mode:", mode);
            uniqueId_1 = (0, uuid_1.v4)();
            // ✅ Store initial status in memory
            processingStatus[uniqueId_1] = { status: "inProgress" };
            // ✅ Send immediate response with tracking ID
            res.status(200).json({ id: uniqueId_1, status: "inProgress" });
            // ✅ Process the document asynchronously
            (0, document_service_1.processDocumentFile)({
                fileName: fileName,
                fileBase64: fileBase64,
                mode: mode,
                uniqueId: uniqueId_1,
                progressCallback: function (message) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                processingStatus[uniqueId_1] = { status: message };
                                // ✅ Send updates as new requests (replace with real client callback URL)
                                return [4 /*yield*/, axios_1.default.post("".concat(env_1.default.backend, "/api/v1/documents/update"), {
                                        id: uniqueId_1,
                                        status: message,
                                    }).catch(function (err) { return console.error("Error sending update:", err); })];
                            case 1:
                                // ✅ Send updates as new requests (replace with real client callback URL)
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); },
            }).then(function (result) {
                processingStatus[uniqueId_1] = { status: "completed", data: result };
                console.log("Processing completed:", env_1.default.backend);
                // ✅ Send final update to client callback URL
                axios_1.default.post("".concat(env_1.default.backend, "/api/v1/documents/update"), {
                    id: uniqueId_1,
                    success: true,
                    data: result,
                }).catch(function (err) { return console.error("Error sending final update:", err); });
            }).catch(function (err) {
                processingStatus[uniqueId_1] = { status: "failed" };
                console.error("Processing error:", err);
            });
        }
        catch (err) {
            console.error("Error in ingestDocument:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
        return [2 /*return*/];
    });
}); };
exports.ingestDocument = ingestDocument;
/**
 * Handle document status check
 */
var getDocumentStatus = function (req, res) {
    var id = req.params.id;
    if (!processingStatus[id]) {
        return res.status(404).json({ error: "Document not found" });
    }
    res.json(__assign({ id: id }, processingStatus[id]));
};
exports.getDocumentStatus = getDocumentStatus;
/**
 * Receive document update notifications (Client Callback)
 */
var receiveUpdate = function (req, res) {
    console.log("Received update:", req.body);
    res.json({ success: true });
};
exports.receiveUpdate = receiveUpdate;
