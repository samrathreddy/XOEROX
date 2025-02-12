"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var env_1 = __importDefault(require("./config/env"));
var app = (0, app_1.default)();
app.listen(env_1.default.port, function () {
    console.log("Server running on ".concat(env_1.default.backend));
});
