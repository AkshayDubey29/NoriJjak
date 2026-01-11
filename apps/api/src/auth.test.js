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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var vitest_1 = require("vitest");
var supertest_1 = require("supertest");
var index_1 = require("./index");
var db_1 = require("./lib/db");
var redis_1 = require("./lib/redis");
(0, vitest_1.describe)('Auth API', function () {
    var testUser = {
        email: 'test-auth-unique@example.com',
        password: 'password123',
        termsAccepted: true,
        privacyAccepted: true,
    };
    (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Clean up
                return [4 /*yield*/, db_1.default.consent.deleteMany({ where: { user: { email: testUser.email } } })];
                case 1:
                    // Clean up
                    _a.sent();
                    return [4 /*yield*/, db_1.default.deletionRequest.deleteMany({ where: { user: { email: testUser.email } } })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.user.deleteMany({ where: { email: testUser.email } })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.$disconnect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, redis_1.default.quit()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('POST /auth/signup - Success', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(index_1.default).post('/auth/signup').send(testUser)];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(201);
                    (0, vitest_1.expect)(res.body.message).toBe('User created');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('POST /auth/login - Success', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(index_1.default).post('/auth/login').send({
                        email: testUser.email,
                        password: testUser.password,
                    })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    (0, vitest_1.expect)(res.body.accessToken).toBeDefined();
                    (0, vitest_1.expect)(res.body.refreshToken).toBeDefined();
                    (0, vitest_1.expect)(res.body.user.email).toBe(testUser.email);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('GET /auth/me - Success (Protected)', function () { return __awaiter(void 0, void 0, void 0, function () {
        var loginRes, token, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(index_1.default).post('/auth/login').send({
                        email: testUser.email,
                        password: testUser.password,
                    })];
                case 1:
                    loginRes = _a.sent();
                    token = loginRes.body.accessToken;
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                            .get('/auth/me')
                            .set('Authorization', "Bearer ".concat(token))];
                case 2:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    (0, vitest_1.expect)(res.body.user.email).toBe(testUser.email);
                    (0, vitest_1.expect)(res.body.user.consents).toHaveLength(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('POST /auth/logout - Success', function () { return __awaiter(void 0, void 0, void 0, function () {
        var loginRes, token, res, meRes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(index_1.default).post('/auth/login').send({
                        email: testUser.email,
                        password: testUser.password,
                    })];
                case 1:
                    loginRes = _a.sent();
                    token = loginRes.body.accessToken;
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                            .post('/auth/logout')
                            .set('Authorization', "Bearer ".concat(token))];
                case 2:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    (0, vitest_1.expect)(res.body.message).toBe('Logged out');
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                            .get('/auth/me')
                            .set('Authorization', "Bearer ".concat(token))];
                case 3:
                    meRes = _a.sent();
                    (0, vitest_1.expect)(meRes.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
});
