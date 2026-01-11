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
var express_1 = require("express");
var db_1 = require("../lib/db");
var auth_1 = require("../middlewares/auth");
var schemas_1 = require("../lib/schemas");
var router = (0, express_1.Router)({ mergeParams: true });
// Helper to check if user is allowed to chat in this game
var canChat = function (userId, gameId) { return __awaiter(void 0, void 0, void 0, function () {
    var game;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.default.game.findUnique({
                    where: { id: gameId },
                    include: {
                        participants: {
                            where: { userId: userId, status: 'APPROVED' },
                        },
                    },
                })];
            case 1:
                game = _a.sent();
                if (!game)
                    return [2 /*return*/, false];
                if (game.hostId === userId)
                    return [2 /*return*/, true];
                if (game.participants.length > 0)
                    return [2 /*return*/, true];
                return [2 /*return*/, false];
        }
    });
}); };
// List chat messages
router.get('/', auth_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameId, userId, query, blockedByMe, blockedIds, messages, nextCursor, error_1, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                gameId = req.params.id;
                userId = req.user.id;
                return [4 /*yield*/, canChat(userId, gameId)];
            case 1:
                if (!(_a.sent())) {
                    return [2 /*return*/, res.status(403).json({ error: 'Only approved participants can view chat' })];
                }
                query = schemas_1.ChatMessageFilterSchema.parse(req.query);
                return [4 /*yield*/, db_1.default.block.findMany({
                        where: { blockerId: userId },
                        select: { blockedId: true },
                    })];
            case 2:
                blockedByMe = _a.sent();
                blockedIds = blockedByMe.map(function (b) { return b.blockedId; });
                return [4 /*yield*/, db_1.default.chatMessage.findMany({
                        where: {
                            gameId: gameId,
                            isDeleted: false,
                            senderId: { notIn: blockedIds }, // Hide messages from blocked users
                        },
                        take: query.limit,
                        skip: query.cursor ? 1 : 0,
                        cursor: query.cursor ? { id: query.cursor } : undefined,
                        include: {
                            sender: { select: { id: true, displayName: true } },
                        },
                        orderBy: { createdAt: 'desc' },
                    })];
            case 3:
                messages = _a.sent();
                nextCursor = messages.length === query.limit ? messages[messages.length - 1].id : null;
                // Return messages in chronological order for UI
                res.json({ messages: messages.reverse(), nextCursor: nextCursor });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                message = error_1 instanceof Error ? error_1.message : 'Failed to fetch messages';
                res.status(400).json({ error: message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Send message
router.post('/', auth_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameId, userId, body, chatMessage, error_2, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                gameId = req.params.id;
                userId = req.user.id;
                return [4 /*yield*/, canChat(userId, gameId)];
            case 1:
                if (!(_a.sent())) {
                    return [2 /*return*/, res.status(403).json({ error: 'Only approved participants can send messages' })];
                }
                body = schemas_1.SendChatMessageSchema.parse(req.body);
                return [4 /*yield*/, db_1.default.chatMessage.create({
                        data: {
                            gameId: gameId,
                            senderId: userId,
                            body: body.body,
                        },
                        include: {
                            sender: { select: { id: true, displayName: true } },
                        },
                    })];
            case 2:
                chatMessage = _a.sent();
                res.status(201).json({ chatMessage: chatMessage });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                message = error_2 instanceof Error ? error_2.message : 'Failed to send message';
                res.status(400).json({ error: message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Delete own message
router.delete('/:messageId', auth_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var messageId, userId, message, error_3, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                messageId = req.params.messageId;
                userId = req.user.id;
                return [4 /*yield*/, db_1.default.chatMessage.findUnique({ where: { id: messageId } })];
            case 1:
                message = _a.sent();
                if (!message || message.senderId !== userId) {
                    return [2 /*return*/, res.status(404).json({ error: 'Message not found or unauthorized' })];
                }
                return [4 /*yield*/, db_1.default.chatMessage.update({
                        where: { id: messageId },
                        data: { isDeleted: true },
                    })];
            case 2:
                _a.sent();
                res.json({ message: 'Message deleted' });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                message = error_3 instanceof Error ? error_3.message : 'Failed to delete message';
                res.status(400).json({ error: message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
