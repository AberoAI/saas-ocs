"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.middleware = void 0;
// File: apps/backend/middleware.ts
var auth_1 = require("./src/middleware/auth");
exports.middleware = auth_1.middleware;
exports.config = {
    // Proteksi semua route API dengan middleware ini
    matcher: ["/api/:path*"],
};
