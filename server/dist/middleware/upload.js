"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
// Configure multer to store files temporarily
var storage = multer_1.default.memoryStorage();
var upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: function (req, file, cb) {
        var fileTypes = /pdf|jpg|jpeg|png/;
        var ext = path_1.default.extname(file.originalname).toLowerCase();
        if (fileTypes.test(ext)) {
            return cb(null, true);
        }
        return cb(new Error('Only PDF and image files are allowed'));
    }
});
exports.default = upload;
