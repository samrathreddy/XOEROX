"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentIngestSchema = void 0;
var zod_1 = require("zod");
exports.documentIngestSchema = zod_1.z.object({
    mode: zod_1.z.enum(["ocr", "gpt"]),
    fileBase64: zod_1.z.string().nonempty("fileBase64 is required")
});
