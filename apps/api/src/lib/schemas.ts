import { z } from 'zod';

export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().optional(),
  locale: z.enum(['ko-KR', 'en-US']).optional(),
  termsAccepted: z.boolean().refine((v) => v === true, "Terms must be accepted"),
  privacyAccepted: z.boolean().refine((v) => v === true, "Privacy policy must be accepted"),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const ConsentSchema = z.object({
  type: z.string(),
  version: z.string(),
  accepted: z.boolean(),
});

export const CreateGameSchema = z.object({
  sportId: z.string().uuid(),
  venueId: z.string().uuid().optional(),
  clubId: z.string().uuid().optional(),
  title: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  homeArea: z.string().min(2),
  capacity: z.number().int().min(2).max(100),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
  joinPolicy: z.enum(['OPEN', 'APPROVAL']).optional(),
});

export const UpdateGameSchema = z.object({
  venueId: z.string().uuid().optional(),
  clubId: z.string().uuid().optional(),
  title: z.string().min(3).max(100).optional(),
  description: z.string().max(1000).optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  capacity: z.number().int().min(2).max(100).optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
  joinPolicy: z.enum(['OPEN', 'APPROVAL']).optional(),
});

export const GameFilterSchema = z.object({
  sportId: z.string().uuid().optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  homeArea: z.string().optional(),
  status: z.enum(['OPEN', 'CANCELLED', 'COMPLETED']).optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
  cursor: z.string().optional(),
  limit: z.preprocess((val) => Number(val), z.number().int().min(1).max(100)).optional().default(20),
});

export const JoinGameSchema = z.object({
  inviteToken: z.string().optional(),
});

export const CreateInviteSchema = z.object({
  maxUses: z.number().int().min(1).max(100).optional(),
  expiresInHours: z.number().int().min(1).max(720).optional(),
});

export const VenueFilterSchema = z.object({
  sportId: z.string().uuid().optional(),
  area: z.string().optional(),
  query: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.preprocess((val) => Number(val), z.number().int().min(1).max(100)).optional().default(20),
});

export const CreateClubSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(1000).optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
  joinPolicy: z.enum(['OPEN', 'APPROVAL', 'INVITE']).optional(),
  homeArea: z.string().min(2),
  sportIds: z.array(z.string().uuid()).min(1),
});

export const UpdateClubSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().max(1000).optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
  joinPolicy: z.enum(['OPEN', 'APPROVAL', 'INVITE']).optional(),
  homeArea: z.string().min(2).optional(),
  sportIds: z.array(z.string().uuid()).optional(),
});

export const ClubFilterSchema = z.object({
  sportId: z.string().uuid().optional(),
  homeArea: z.string().optional(),
  query: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.preprocess((val) => Number(val), z.number().int().min(1).max(100)).optional().default(20),
});

export const SendChatMessageSchema = z.object({
  body: z.string().min(1).max(1000),
});

export const ChatMessageFilterSchema = z.object({
  cursor: z.string().optional(),
  limit: z.preprocess((val) => Number(val), z.number().int().min(1).max(100)).optional().default(50),
});

export const CreateReportSchema = z.object({
  reportedId: z.string().uuid(),
  messageId: z.string().uuid().optional(),
  ratingId: z.string().uuid().optional(),
  gameId: z.string().uuid().optional(),
  reasonCode: z.enum(['SPAM', 'ABUSE', 'INAPPROPRIATE', 'HARASSMENT', 'OTHER']),
  note: z.string().max(500).optional(),
});

export const CreateRatingSchema = z.object({
  gameId: z.string().uuid().optional(),
  targetUserId: z.string().uuid().optional(),
  targetVenueId: z.string().uuid().optional(),
  targetClubId: z.string().uuid().optional(),
  score: z.number().int().min(1).max(5),
  comment: z.string().max(300).optional(),
  categories: z.array(z.string()).optional(),
}).refine(data => data.targetUserId || data.targetVenueId || data.targetClubId, {
  message: "At least one target (user, venue, or club) must be specified",
});


