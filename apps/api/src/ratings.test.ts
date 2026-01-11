import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from './index';
import prisma from './lib/db';
import redis from './lib/redis';

describe('Ratings & Reputation API', () => {
  let user1Token: string;
  let userId1: string;
  let user2Token: string;
  let userId2: string;
  let gameId: string;
  let sportId: string;

  beforeAll(async () => {
    const testEmails = ['rate1@example.com', 'rate2@example.com'];
    
    // Clean up
    await prisma.report.deleteMany();
    await prisma.rating.deleteMany();
    await prisma.chatMessage.deleteMany();
    await prisma.clubMember.deleteMany();
    await prisma.participant.deleteMany();
    await prisma.gameInvite.deleteMany();
    await prisma.game.deleteMany();
    await prisma.user.deleteMany({ where: { email: { in: testEmails } } });

    // Setup users
    const signup1 = await request(app).post('/auth/signup').send({
      email: testEmails[0], password: 'password123', termsAccepted: true, privacyAccepted: true,
    });
    userId1 = signup1.body.user.id;
    await prisma.user.update({ where: { id: userId1 }, data: { onboardingStep: 'DONE' } });
    const login1 = await request(app).post('/auth/login').send({ email: testEmails[0], password: 'password123' });
    user1Token = login1.body.accessToken;

    const signup2 = await request(app).post('/auth/signup').send({
      email: testEmails[1], password: 'password123', termsAccepted: true, privacyAccepted: true,
    });
    userId2 = signup2.body.user.id;
    await prisma.user.update({ where: { id: userId2 }, data: { onboardingStep: 'DONE' } });
    const login2 = await request(app).post('/auth/login').send({ email: testEmails[1], password: 'password123' });
    user2Token = login2.body.accessToken;

    const sport = await prisma.sport.findFirst();
    sportId = sport!.id;

    // Create a completed game
    const gameRes = await request(app).post('/games').set('Authorization', `Bearer ${user1Token}`).send({
      sportId, title: 'Rating Game', startTime: new Date(Date.now() - 7200000).toISOString(),
      endTime: new Date(Date.now() - 3600000).toISOString(), homeArea: 'Seoul', capacity: 10,
    });
    gameId = gameRes.body.game.id;
    await prisma.game.update({ where: { id: gameId }, data: { status: 'COMPLETED' } });

    // User 2 was a participant
    await prisma.participant.create({
      data: { gameId, userId: userId2, status: 'APPROVED' }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await redis.quit();
  });

  it('POST /ratings - Rate a player', async () => {
    const res = await request(app)
      .post('/ratings')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        gameId,
        targetUserId: userId2,
        score: 5,
        comment: 'Great player!',
        categories: ['SKILL', 'MANNER']
      });

    expect(res.status).toBe(201);
    expect(res.body.rating.score).toBe(5);
  });

  it('POST /ratings - Cannot rate self', async () => {
    const res = await request(app)
      .post('/ratings')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        gameId,
        targetUserId: userId1,
        score: 5
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Cannot rate yourself');
  });

  it('GET /ratings/summary/user/:id - Get player reputation', async () => {
    const res = await request(app)
      .get(`/ratings/summary/user/${userId2}`);

    expect(res.status).toBe(200);
    expect(res.body.average).toBe(5);
    expect(res.body.count).toBe(1);
  });

  it('GET /ratings/user/:id - List user ratings', async () => {
    const res = await request(app)
      .get(`/ratings/user/${userId2}`);

    expect(res.status).toBe(200);
    expect(res.body.ratings.length).toBe(1);
    expect(res.body.ratings[0].rater.displayName).toBeDefined();
  });

  it('POST /safety/reports - Report a rating', async () => {
    const ratingsRes = await request(app).get(`/ratings/user/${userId2}`);
    const ratingId = ratingsRes.body.ratings[0].id;

    const res = await request(app)
      .post('/safety/reports')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        reportedId: userId1,
        ratingId,
        reasonCode: 'ABUSE',
        note: 'This rating is unfair'
      });

    expect(res.status).toBe(201);
    expect(res.body.report.ratingId).toBe(ratingId);
  });
});

