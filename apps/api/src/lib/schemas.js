"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRatingSchema = exports.CreateReportSchema = exports.ChatMessageFilterSchema = exports.SendChatMessageSchema = exports.ClubFilterSchema = exports.UpdateClubSchema = exports.CreateClubSchema = exports.VenueFilterSchema = exports.CreateInviteSchema = exports.JoinGameSchema = exports.GameFilterSchema = exports.UpdateGameSchema = exports.CreateGameSchema = exports.ConsentSchema = exports.LoginSchema = exports.SignupSchema = void 0;
var zod_1 = require("zod");
exports.SignupSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    displayName: zod_1.z.string().optional(),
    locale: zod_1.z.enum(['ko-KR', 'en-US']).optional(),
    termsAccepted: zod_1.z.boolean().refine(function (v) { return v === true; }, "Terms must be accepted"),
    privacyAccepted: zod_1.z.boolean().refine(function (v) { return v === true; }, "Privacy policy must be accepted"),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.ConsentSchema = zod_1.z.object({
    type: zod_1.z.string(),
    version: zod_1.z.string(),
    accepted: zod_1.z.boolean(),
});
exports.CreateGameSchema = zod_1.z.object({
    sportId: zod_1.z.string().uuid(),
    venueId: zod_1.z.string().uuid().optional(),
    clubId: zod_1.z.string().uuid().optional(),
    title: zod_1.z.string().min(3).max(100),
    description: zod_1.z.string().max(1000).optional(),
    startTime: zod_1.z.string().datetime(),
    endTime: zod_1.z.string().datetime(),
    homeArea: zod_1.z.string().min(2),
    capacity: zod_1.z.number().int().min(2).max(100),
    visibility: zod_1.z.enum(['PUBLIC', 'PRIVATE']).optional(),
    joinPolicy: zod_1.z.enum(['OPEN', 'APPROVAL']).optional(),
});
exports.UpdateGameSchema = zod_1.z.object({
    venueId: zod_1.z.string().uuid().optional(),
    clubId: zod_1.z.string().uuid().optional(),
    title: zod_1.z.string().min(3).max(100).optional(),
    description: zod_1.z.string().max(1000).optional(),
    startTime: zod_1.z.string().datetime().optional(),
    endTime: zod_1.z.string().datetime().optional(),
    capacity: zod_1.z.number().int().min(2).max(100).optional(),
    visibility: zod_1.z.enum(['PUBLIC', 'PRIVATE']).optional(),
    joinPolicy: zod_1.z.enum(['OPEN', 'APPROVAL']).optional(),
});
exports.GameFilterSchema = zod_1.z.object({
    sportId: zod_1.z.string().uuid().optional(),
    startTime: zod_1.z.string().datetime().optional(),
    endTime: zod_1.z.string().datetime().optional(),
    homeArea: zod_1.z.string().optional(),
    status: zod_1.z.enum(['OPEN', 'CANCELLED', 'COMPLETED']).optional(),
    visibility: zod_1.z.enum(['PUBLIC', 'PRIVATE']).optional(),
    cursor: zod_1.z.string().optional(),
    limit: zod_1.z.preprocess(function (val) { return Number(val); }, zod_1.z.number().int().min(1).max(100)).optional().default(20),
});
exports.JoinGameSchema = zod_1.z.object({
    inviteToken: zod_1.z.string().optional(),
});
exports.CreateInviteSchema = zod_1.z.object({
    maxUses: zod_1.z.number().int().min(1).max(100).optional(),
    expiresInHours: zod_1.z.number().int().min(1).max(720).optional(),
});
exports.VenueFilterSchema = zod_1.z.object({
    sportId: zod_1.z.string().uuid().optional(),
    area: zod_1.z.string().optional(),
    query: zod_1.z.string().optional(),
    cursor: zod_1.z.string().optional(),
    limit: zod_1.z.preprocess(function (val) { return Number(val); }, zod_1.z.number().int().min(1).max(100)).optional().default(20),
});
exports.CreateClubSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(50),
    description: zod_1.z.string().max(1000).optional(),
    visibility: zod_1.z.enum(['PUBLIC', 'PRIVATE']).optional(),
    joinPolicy: zod_1.z.enum(['OPEN', 'APPROVAL', 'INVITE']).optional(),
    homeArea: zod_1.z.string().min(2),
    sportIds: zod_1.z.array(zod_1.z.string().uuid()).min(1),
});
exports.UpdateClubSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(50).optional(),
    description: zod_1.z.string().max(1000).optional(),
    visibility: zod_1.z.enum(['PUBLIC', 'PRIVATE']).optional(),
    joinPolicy: zod_1.z.enum(['OPEN', 'APPROVAL', 'INVITE']).optional(),
    homeArea: zod_1.z.string().min(2).optional(),
    sportIds: zod_1.z.array(zod_1.z.string().uuid()).optional(),
});
exports.ClubFilterSchema = zod_1.z.object({
    sportId: zod_1.z.string().uuid().optional(),
    homeArea: zod_1.z.string().optional(),
    query: zod_1.z.string().optional(),
    cursor: zod_1.z.string().optional(),
    limit: zod_1.z.preprocess(function (val) { return Number(val); }, zod_1.z.number().int().min(1).max(100)).optional().default(20),
});
exports.SendChatMessageSchema = zod_1.z.object({
    body: zod_1.z.string().min(1).max(1000),
});
exports.ChatMessageFilterSchema = zod_1.z.object({
    cursor: zod_1.z.string().optional(),
    limit: zod_1.z.preprocess(function (val) { return Number(val); }, zod_1.z.number().int().min(1).max(100)).optional().default(50),
});
exports.CreateReportSchema = zod_1.z.object({
    reportedId: zod_1.z.string().uuid(),
    messageId: zod_1.z.string().uuid().optional(),
    ratingId: zod_1.z.string().uuid().optional(),
    gameId: zod_1.z.string().uuid().optional(),
    reasonCode: zod_1.z.enum(['SPAM', 'ABUSE', 'INAPPROPRIATE', 'HARASSMENT', 'OTHER']),
    note: zod_1.z.string().max(500).optional(),
});
exports.CreateRatingSchema = zod_1.z.object({
    gameId: zod_1.z.string().uuid().optional(),
    targetUserId: zod_1.z.string().uuid().optional(),
    targetVenueId: zod_1.z.string().uuid().optional(),
    targetClubId: zod_1.z.string().uuid().optional(),
    score: zod_1.z.number().int().min(1).max(5),
    comment: zod_1.z.string().max(300).optional(),
    categories: zod_1.z.array(zod_1.z.string()).optional(),
}).refine(function (data) { return data.targetUserId || data.targetVenueId || data.targetClubId; }, {
    message: "At least one target (user, venue, or club) must be specified",
});
