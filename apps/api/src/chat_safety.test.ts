import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from './index';
import prisma from './lib/db';
import redis from './lib/redis';

describe('Chat & Safety API', () => {
  let user1Token: string;
  let userId1: string;
  let user2Token: string;
  let userId2: string;
  let gameId: string;
  let sportId: string;

  beforeAll(async () => {
    const testEmails = ['chat1@example.com', 'chat2@example.com'];
    
    // Clean up in correct order
    await prisma.report.deleteMany({ where: { reporter: { email: { in: testEmails } } } });
    await prisma.chatMessage.deleteMany({ where: { sender: { email: { in: testEmails } } } });
    await prisma.block.deleteMany({ where: { blocker: { email: { in: testEmails } } } });
    await prisma.clubMember.deleteMany({ where: { user: { email: { in: testEmails } } } });
    await prisma.participant.deleteMany({ where: { user: { email: { in: testEmails } } } });
    await prisma.gameInvite.deleteMany({ where: { game: { host: { email: { in: testEmails } } } } });
    await prisma.game.deleteMany({ where: { host: { email: { in: testEmails } } } });
    await prisma.consent.deleteMany({ where: { user: { email: { in: testEmails } } } });
    await prisma.userPreference.deleteMany({ where: { user: { email: { in: testEmails } } } });
    await prisma.userSport.deleteMany({ where: { user: { email: { in: testEmails } } } });
    await prisma.deletionRequest.deleteMany({ where: { user: { email: { in: testEmails } } } });
    await prisma.deviceToken.deleteMany({ where: { user: { email: { in: testEmails } } } });
    await prisma.user.deleteMany({ where: { email: { in: testEmails } } });

    // Setup user 1 (host)
    const signup1 = await request(app).post('/auth/signup').send({
      email: testEmails[0], password: 'password123', termsAccepted: true, privacyAccepted: true,
    });
    userId1 = signup1.body.user.id;
    await prisma.user.update({ where: { id: userId1 }, data: { onboardingStep: 'DONE' } });
    const login1 = await request(app).post('/auth/login').send({ email: testEmails[0], password: 'password123' });
    user1Token = login1.body.accessToken;

    // Setup user 2 (participant)
    const signup2 = await request(app).post('/auth/signup').send({
      email: testEmails[1], password: 'password123', termsAccepted: true, privacyAccepted: true,
    });
    userId2 = signup2.body.user.id;
    await prisma.user.update({ where: { id: userId2 }, data: { onboardingStep: 'DONE' } });
    const login2 = await request(app).post('/auth/login').send({ email: testEmails[1], password: 'password123' });
    user2Token = login2.body.accessToken;

    const sport = await prisma.sport.findFirst();
    sportId = sport!.id;

    // Create a game
    const gameRes = await request(app).post('/games').set('Authorization', `Bearer ${user1Token}`).send({
      sportId, title: 'Chat Game', startTime: new Date(Date.now() + 86400000).toISOString(),
      endTime: new Date(Date.now() + 90000000).toISOString(), homeArea: 'Seoul', capacity: 10,
    });
    gameId = gameRes.body.game.id;

    // User 2 joins
    await request(app).post(`/games/${gameId}/join`).set('Authorization', `Bearer ${user2Token}`);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await redis.quit();
  });

  it('POST /games/:id/chat - Send message (Host)', async () => {
    const res = await request(app)
      .post(`/games/${gameId}/chat`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ body: 'Hello from host' });

    expect(res.status).toBe(201);
    expect(res.body.chatMessage.body).toBe('Hello from host');
  });

  it('POST /games/:id/chat - Send message (Participant)', async () => {
    const res = await request(app)
      .post(`/games/${gameId}/chat`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ body: 'Hello from participant' });

    expect(res.status).toBe(201);
  });

  it('GET /games/:id/chat - List messages', async () => {
    const res = await request(app)
      .get(`/games/${gameId}/chat`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.messages.length).toBeGreaterThanOrEqual(2);
  });

  it('POST /safety/block/:userId - Block user', async () => {
    const res = await request(app)
      .post(`/safety/block/${userId2}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User blocked');
  });

  it('GET /games/:id/chat - Messages from blocked users are hidden', async () => {
    const res = await request(app)
      .get(`/games/${gameId}/chat`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res.status).toBe(200);
    // userId2 is blocked by userId1, so userId1 should not see messages from userId2
    expect(res.body.messages.some((m: { senderId: string }) => m.senderId === userId2)).toBe(false);
  });

  it('POST /safety/reports - Report message', async () => {
    const messagesRes = await request(app)
      .get(`/games/${gameId}/chat`)
      .set('Authorization', `Bearer ${user1Token}`);
    const messageId = messagesRes.body.messages[0].id;

    const res = await request(app)
      .post('/safety/reports')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        reportedId: userId2,
        messageId,
        gameId,
        reasonCode: 'SPAM',
        note: 'Too much spam',
      });

    expect(res.status).toBe(201);
    expect(res.body.report.reasonCode).toBe('SPAM');
  });
});
