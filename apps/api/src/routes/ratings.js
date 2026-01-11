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
var express_1 = require("express");
var db_1 = require("../lib/db");
var auth_1 = require("../middlewares/auth");
var schemas_1 = require("../lib/schemas");
var router = (0, express_1.Router)();
// Create or update a rating
router.post('/', auth_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, data, game, isHost, isParticipant, targetParticipant, targetIsHost, membership, rating, error_1, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                userId = req.user.id;
                data = schemas_1.CreateRatingSchema.parse(req.body);
                if (!data.gameId) return [3 /*break*/, 4];
                return [4 /*yield*/, db_1.default.game.findUnique({
                        where: { id: data.gameId },
                        include: {
                            participants: { where: { userId: userId, status: 'APPROVED' } }
                        }
                    })];
            case 1:
                game = _a.sent();
                if (!game)
                    return [2 /*return*/, res.status(404).json({ error: 'Game not found' })];
                if (game.status !== 'COMPLETED' && new Date(game.endTime) > new Date()) {
                    return [2 /*return*/, res.status(400).json({ error: 'Cannot rate until game is completed' })];
                }
                isHost = game.hostId === userId;
                isParticipant = game.participants.length > 0;
                if (!isHost && !isParticipant) {
                    return [2 /*return*/, res.status(403).json({ error: 'Only approved participants can rate' })];
                }
                if (!data.targetUserId) return [3 /*break*/, 3];
                if (data.targetUserId === userId)
                    return [2 /*return*/, res.status(400).json({ error: 'Cannot rate yourself' })];
                return [4 /*yield*/, db_1.default.participant.findFirst({
                        where: { gameId: data.gameId, userId: data.targetUserId, status: 'APPROVED' }
                    })];
            case 2:
                targetParticipant = _a.sent();
                targetIsHost = game.hostId === data.targetUserId;
                if (!targetParticipant && !targetIsHost) {
                    return [2 /*return*/, res.status(400).json({ error: 'Target user was not in this game' })];
                }
                _a.label = 3;
            case 3:
                // If rating a venue, ensure it was the venue for the game
                if (data.targetVenueId && game.venueId !== data.targetVenueId) {
                    return [2 /*return*/, res.status(400).json({ error: 'Target venue was not the venue for this game' })];
                }
                _a.label = 4;
            case 4:
                if (!data.targetClubId) return [3 /*break*/, 6];
                return [4 /*yield*/, db_1.default.clubMember.findUnique({
                        where: { clubId_userId: { clubId: data.targetClubId, userId: userId } }
                    })];
            case 5:
                membership = _a.sent();
                if (!membership || membership.status !== 'APPROVED') {
                    return [2 /*return*/, res.status(403).json({ error: 'Only club members can rate the club' })];
                }
                _a.label = 6;
            case 6: return [4 /*yield*/, db_1.default.rating.upsert({
                    where: {
                        raterId_gameId_targetUserId: data.targetUserId ? { raterId: userId, gameId: data.gameId || null, targetUserId: data.targetUserId } : undefined,
                        raterId_gameId_targetVenueId: data.targetVenueId ? { raterId: userId, gameId: data.gameId || null, targetVenueId: data.targetVenueId } : undefined,
                        raterId_targetClubId: data.targetClubId ? { raterId: userId, targetClubId: data.targetClubId } : undefined,
                    },
                    create: __assign(__assign({}, data), { raterId: userId }),
                    update: {
                        score: data.score,
                        comment: data.comment,
                        categories: data.categories,
                    },
                })];
            case 7:
                rating = _a.sent();
                res.status(201).json({ rating: rating });
                return [3 /*break*/, 9];
            case 8:
                error_1 = _a.sent();
                message = error_1 instanceof Error ? error_1.message : 'Failed to save rating';
                res.status(400).json({ error: message });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
// Get reputation summary
router.get('/summary/:type/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, id, where, ratings, count, avg, badges, mannersRatings, mannersAvg, error_2, message;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.params, type = _a.type, id = _a.id;
                where = {};
                if (type === 'user')
                    where.targetUserId = id;
                else if (type === 'venue')
                    where.targetVenueId = id;
                else if (type === 'club')
                    where.targetClubId = id;
                else
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid type' })];
                return [4 /*yield*/, db_1.default.rating.findMany({ where: where })];
            case 1:
                ratings = _b.sent();
                count = ratings.length;
                avg = count > 0 ? ratings.reduce(function (sum, r) { return sum + r.score; }, 0) / count : 0;
                badges = [];
                if (type === 'user') {
                    if (count >= 10 && avg >= 4.5)
                        badges.push('SUPER_PLAYER');
                    mannersRatings = ratings.filter(function (r) { var _a; return (_a = r.categories) === null || _a === void 0 ? void 0 : _a.includes('MANNER'); });
                    mannersAvg = mannersRatings.length > 0 ? mannersRatings.reduce(function (sum, r) { return sum + r.score; }, 0) / mannersRatings.length : 0;
                    if (mannersAvg >= 4.5)
                        badges.push('GOLDEN_MANNER');
                }
                res.json({
                    average: Number(avg.toFixed(1)),
                    count: count,
                    badges: badges,
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                message = error_2 instanceof Error ? error_2.message : 'Failed to fetch summary';
                res.status(400).json({ error: message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// List ratings
router.get('/:type/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, id, where, ratings, error_3, message;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.params, type = _a.type, id = _a.id;
                where = {};
                if (type === 'user')
                    where.targetUserId = id;
                else if (type === 'venue')
                    where.targetVenueId = id;
                else if (type === 'club')
                    where.targetClubId = id;
                return [4 /*yield*/, db_1.default.rating.findMany({
                        where: where,
                        include: {
                            rater: { select: { id: true, displayName: true } }
                        },
                        orderBy: { createdAt: 'desc' },
                        take: 20
                    })];
            case 1:
                ratings = _b.sent();
                res.json({ ratings: ratings });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                message = error_3 instanceof Error ? error_3.message : 'Failed to fetch ratings';
                res.status(400).json({ error: message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
