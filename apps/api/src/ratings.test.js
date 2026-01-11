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
(0, vitest_1.describe)('Ratings & Reputation API', function () {
    var user1Token;
    var userId1;
    var user2Token;
    var userId2;
    var gameId;
    var sportId;
    (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var testEmails, signup1, login1, signup2, login2, sport, gameRes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testEmails = ['rate1@example.com', 'rate2@example.com'];
                    // Clean up
                    return [4 /*yield*/, db_1.default.report.deleteMany()];
                case 1:
                    // Clean up
                    _a.sent();
                    return [4 /*yield*/, db_1.default.rating.deleteMany()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.chatMessage.deleteMany()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.clubMember.deleteMany()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.participant.deleteMany()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.gameInvite.deleteMany()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.game.deleteMany()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.user.deleteMany({ where: { email: { in: testEmails } } })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default).post('/auth/signup').send({
                            email: testEmails[0], password: 'password123', termsAccepted: true, privacyAccepted: true,
                        })];
                case 9:
                    signup1 = _a.sent();
                    userId1 = signup1.body.user.id;
                    return [4 /*yield*/, db_1.default.user.update({ where: { id: userId1 }, data: { onboardingStep: 'DONE' } })];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default).post('/auth/login').send({ email: testEmails[0], password: 'password123' })];
                case 11:
                    login1 = _a.sent();
                    user1Token = login1.body.accessToken;
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default).post('/auth/signup').send({
                            email: testEmails[1], password: 'password123', termsAccepted: true, privacyAccepted: true,
                        })];
                case 12:
                    signup2 = _a.sent();
                    userId2 = signup2.body.user.id;
                    return [4 /*yield*/, db_1.default.user.update({ where: { id: userId2 }, data: { onboardingStep: 'DONE' } })];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default).post('/auth/login').send({ email: testEmails[1], password: 'password123' })];
                case 14:
                    login2 = _a.sent();
                    user2Token = login2.body.accessToken;
                    return [4 /*yield*/, db_1.default.sport.findFirst()];
                case 15:
                    sport = _a.sent();
                    sportId = sport.id;
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default).post('/games').set('Authorization', "Bearer ".concat(user1Token)).send({
                            sportId: sportId,
                            title: 'Rating Game', startTime: new Date(Date.now() - 7200000).toISOString(),
                            endTime: new Date(Date.now() - 3600000).toISOString(), homeArea: 'Seoul', capacity: 10,
                        })];
                case 16:
                    gameRes = _a.sent();
                    gameId = gameRes.body.game.id;
                    return [4 /*yield*/, db_1.default.game.update({ where: { id: gameId }, data: { status: 'COMPLETED' } })];
                case 17:
                    _a.sent();
                    // User 2 was a participant
                    return [4 /*yield*/, db_1.default.participant.create({
                            data: { gameId: gameId, userId: userId2, status: 'APPROVED' }
                        })];
                case 18:
                    // User 2 was a participant
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
    (0, vitest_1.it)('POST /ratings - Rate a player', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                        .post('/ratings')
                        .set('Authorization', "Bearer ".concat(user1Token))
                        .send({
                        gameId: gameId,
                        targetUserId: userId2,
                        score: 5,
                        comment: 'Great player!',
                        categories: ['SKILL', 'MANNER']
                    })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(201);
                    (0, vitest_1.expect)(res.body.rating.score).toBe(5);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('POST /ratings - Cannot rate self', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                        .post('/ratings')
                        .set('Authorization', "Bearer ".concat(user1Token))
                        .send({
                        gameId: gameId,
                        targetUserId: userId1,
                        score: 5
                    })];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(400);
                    (0, vitest_1.expect)(res.body.error).toContain('Cannot rate yourself');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('GET /ratings/summary/user/:id - Get player reputation', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                        .get("/ratings/summary/user/".concat(userId2))];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    (0, vitest_1.expect)(res.body.average).toBe(5);
                    (0, vitest_1.expect)(res.body.count).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('GET /ratings/user/:id - List user ratings', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                        .get("/ratings/user/".concat(userId2))];
                case 1:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(200);
                    (0, vitest_1.expect)(res.body.ratings.length).toBe(1);
                    (0, vitest_1.expect)(res.body.ratings[0].rater.displayName).toBeDefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('POST /safety/reports - Report a rating', function () { return __awaiter(void 0, void 0, void 0, function () {
        var ratingsRes, ratingId, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(index_1.default).get("/ratings/user/".concat(userId2))];
                case 1:
                    ratingsRes = _a.sent();
                    ratingId = ratingsRes.body.ratings[0].id;
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                            .post('/safety/reports')
                            .set('Authorization', "Bearer ".concat(user2Token))
                            .send({
                            reportedId: userId1,
                            ratingId: ratingId,
                            reasonCode: 'ABUSE',
                            note: 'This rating is unfair'
                        })];
                case 2:
                    res = _a.sent();
                    (0, vitest_1.expect)(res.status).toBe(201);
                    (0, vitest_1.expect)(res.body.report.ratingId).toBe(ratingId);
                    return [2 /*return*/];
            }
        });
    }); });
});
