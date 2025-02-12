"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var index_routes_1 = __importDefault(require("./routes/index.routes"));
var createApp = function () {
    var app = (0, express_1.default)();
    // Middlewares
    app.use((0, cors_1.default)());
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    // Routes
    app.use('/api', index_routes_1.default);
    // Live check
    app.get('/', function (req, res) {
        res.send('Welcome to OCR API!');
    });
    return app;
};
exports.default = createApp;
