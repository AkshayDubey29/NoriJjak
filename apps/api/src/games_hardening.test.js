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
(0, vitest_1.describe)('Games Hardening API', function () {
    var hostToken;
    var userToken;
    var sportId;
    (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var hostEmail, userEmail, hostLogin, userLogin, sports;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hostEmail = 'host-hardening@example.com';
                    userEmail = 'user-hardening@example.com';
                    return [4 /*yield*/, db_1.default.notification.deleteMany({ where: { user: { email: { in: [hostEmail, userEmail] } } } })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.participant.deleteMany({ where: { user: { email: { in: [hostEmail, userEmail] } } } })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.gameInvite.deleteMany({ where: { game: { host: { email: hostEmail } } } })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.game.deleteMany({ where: { host: { email: hostEmail } } })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.userSport.deleteMany({ where: { user: { email: { in: [hostEmail, userEmail] } } } })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.userPreference.deleteMany({ where: { user: { email: { in: [hostEmail, userEmail] } } } })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.consent.deleteMany({ where: { user: { email: { in: [hostEmail, userEmail] } } } })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.deletionRequest.deleteMany({ where: { user: { email: { in: [hostEmail, userEmail] } } } })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.deviceToken.deleteMany({ where: { user: { email: { in: [hostEmail, userEmail] } } } })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.user.deleteMany({ where: { email: { in: [hostEmail, userEmail] } } })];
                case 10:
                    _a.sent();
                    // Create host
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default).post('/auth/signup').send({
                            email: hostEmail, password: 'password123', termsAccepted: true, privacyAccepted: true
                        })];
                case 11:
                    // Create host
                    _a.sent();
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default).post('/auth/login').send({ email: hostEmail, password: 'password123' })];
                case 12:
                    hostLogin = _a.sent();
                    hostToken = hostLogin.body.accessToken;
                    // Create user
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default).post('/auth/signup').send({
                            email: userEmail, password: 'password123', termsAccepted: true, privacyAccepted: true
                        })];
                case 13:
                    // Create user
                    _a.sent();
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default).post('/auth/login').send({ email: userEmail, password: 'password123' })];
                case 14:
                    userLogin = _a.sent();
                    userToken = userLogin.body.accessToken;
                    return [4 /*yield*/, db_1.default.sport.findMany()];
                case 15:
                    sports = _a.sent();
                    sportId = sports[0].id;
                    // Onboard both
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default).put('/user/preferences').set('Authorization', "Bearer ".concat(hostToken)).send({ homeArea: 'Seoul', sports: [{ sportId: sportId, level: 'BEGINNER' }] })];
                case 16:
                    // Onboard both
                    _a.sent();
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default).put('/user/preferences').set('Authorization', "Bearer ".concat(userToken)).send({ homeArea: 'Seoul', sports: [{ sportId: sportId, level: 'BEGINNER' }] })];
                case 17:
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
    (0, vitest_1.it)('APPROVAL join policy flow', function () { return __awaiter(void 0, void 0, void 0, function () {
        var gameRes, gameId, joinRes, hostNotifs, participantId, checkParticipant, userNotifs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                        .post('/games')
                        .set('Authorization', "Bearer ".concat(hostToken))
                        .send({
                        sportId: sportId,
                        title: 'Approval Game', startTime: new Date(Date.now() + 86400000).toISOString(),
                        endTime: new Date(Date.now() + 90000000).toISOString(), homeArea: 'Seoul', capacity: 2, joinPolicy: 'APPROVAL'
                    })];
                case 1:
                    gameRes = _a.sent();
                    gameId = gameRes.body.game.id;
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                            .post("/games/".concat(gameId, "/join"))
                            .set('Authorization', "Bearer ".concat(userToken))];
                case 2:
                    joinRes = _a.sent();
                    (0, vitest_1.expect)(joinRes.body.participant.status).toBe('REQUESTED');
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default).get('/notifications').set('Authorization', "Bearer ".concat(hostToken))];
                case 3:
                    hostNotifs = _a.sent();
                    (0, vitest_1.expect)(hostNotifs.body.notifications[0].type).toBe('GAME_REQUEST');
                    participantId = joinRes.body.participant.id;
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                            .post("/games/".concat(gameId, "/participants/").concat(participantId, "/approve"))
                            .set('Authorization', "Bearer ".concat(hostToken))];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.participant.findUnique({ where: { id: participantId } })];
                case 5:
                    checkParticipant = _a.sent();
                    (0, vitest_1.expect)(checkParticipant === null || checkParticipant === void 0 ? void 0 : checkParticipant.status).toBe('APPROVED');
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default).get('/notifications').set('Authorization', "Bearer ".concat(userToken))];
                case 6:
                    userNotifs = _a.sent();
                    (0, vitest_1.expect)(userNotifs.body.notifications[0].type).toBe('GAME_APPROVED');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('PRIVATE game with invite token', function () { return __awaiter(void 0, void 0, void 0, function () {
        var gameRes, gameId, failJoin, inviteRes, token, successJoin;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                        .post('/games')
                        .set('Authorization', "Bearer ".concat(hostToken))
                        .send({
                        sportId: sportId,
                        title: 'Private Game', startTime: new Date(Date.now() + 86400000).toISOString(),
                        endTime: new Date(Date.now() + 90000000).toISOString(), homeArea: 'Seoul', capacity: 5, visibility: 'PRIVATE'
                    })];
                case 1:
                    gameRes = _a.sent();
                    gameId = gameRes.body.game.id;
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default).post("/games/".concat(gameId, "/join")).set('Authorization', "Bearer ".concat(userToken))];
                case 2:
                    failJoin = _a.sent();
                    (0, vitest_1.expect)(failJoin.status).toBe(403);
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                            .post("/games/".concat(gameId, "/invites"))
                            .set('Authorization', "Bearer ".concat(hostToken))
                            .send({ maxUses: 1 })];
                case 3:
                    inviteRes = _a.sent();
                    token = inviteRes.body.invite.token;
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                            .post("/games/".concat(gameId, "/join"))
                            .set('Authorization', "Bearer ".concat(userToken))
                            .send({ inviteToken: token })];
                case 4:
                    successJoin = _a.sent();
                    (0, vitest_1.expect)(successJoin.status).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Pagination in games list', function () { return __awaiter(void 0, void 0, void 0, function () {
        var i, res1, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 5)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default).post('/games').set('Authorization', "Bearer ".concat(hostToken)).send({
                            sportId: sportId,
                            title: "Game ".concat(i), startTime: new Date(Date.now() + 86400000 + i * 1000).toISOString(),
                            endTime: new Date(Date.now() + 90000000).toISOString(), homeArea: 'Seoul', capacity: 10
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [4 /*yield*/, (0, supertest_1.default)(index_1.default).get('/games').query({ limit: 2 })];
                case 5:
                    res1 = _a.sent();
                    (0, vitest_1.expect)(res1.body.games).toHaveLength(2);
                    (0, vitest_1.expect)(res1.body.nextCursor).toBeDefined();
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default).get('/games').query({ limit: 2, cursor: res1.body.nextCursor })];
                case 6:
                    res2 = _a.sent();
                    (0, vitest_1.expect)(res2.body.games).toHaveLength(2);
                    (0, vitest_1.expect)(res2.body.games[0].id).not.toBe(res1.body.games[0].id);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Game with venueId', function () { return __awaiter(void 0, void 0, void 0, function () {
        var venue, gameRes, detailRes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.venue.findFirst()];
                case 1:
                    venue = _a.sent();
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default)
                            .post('/games')
                            .set('Authorization', "Bearer ".concat(hostToken))
                            .send({
                            sportId: sportId,
                            title: 'Venue Game', startTime: new Date(Date.now() + 86400000).toISOString(),
                            endTime: new Date(Date.now() + 90000000).toISOString(), homeArea: 'Seoul', capacity: 10,
                            venueId: venue.id
                        })];
                case 2:
                    gameRes = _a.sent();
                    (0, vitest_1.expect)(gameRes.status).toBe(201);
                    (0, vitest_1.expect)(gameRes.body.game.venueId).toBe(venue.id);
                    return [4 /*yield*/, (0, supertest_1.default)(index_1.default).get("/games/".concat(gameRes.body.game.id))];
                case 3:
                    detailRes = _a.sent();
                    (0, vitest_1.expect)(detailRes.body.game.venue).toBeDefined();
                    (0, vitest_1.expect)(detailRes.body.game.venue.id).toBe(venue.id);
                    return [2 /*return*/];
            }
        });
    }); });
});
