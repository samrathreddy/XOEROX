"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var upload_1 = __importDefault(require("../middleware/upload"));
var document_controller_1 = require("../controllers/document.controller");
var router = (0, express_1.Router)();
// Upload route - using multipart/form-data
router.post('/ingest', upload_1.default.single('file'), document_controller_1.ingestDocument);
router.get('/status/:id', document_controller_1.getDocumentStatus);
router.post('/update', document_controller_1.receiveUpdate);
exports.default = router;
