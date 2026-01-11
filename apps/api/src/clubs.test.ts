import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from './index';
import prisma from './lib/db';
import redis from './lib/redis';

describe('Clubs API', () => {
  let userToken: string;
  let userId: string;
  let clubId: string;
  let sportId: string;

  beforeAll(async () => {
    const testEmails = ['clubtest@example.com', 'clubtest2@example.com'];
    
    // Clean up related models first
    await prisma.clubMember.deleteMany({ where: { user: { email: { in: testEmails } } } });
    await prisma.participant.deleteMany({ where: { user: { email: { in: testEmails } } } });
    await prisma.gameInvite.deleteMany({ where: { game: { host: { email: { in: testEmails } } } } });
    await prisma.game.deleteMany({ where: { host: { email: { in: testEmails } } } });
    await prisma.club.deleteMany({ where: { members: { some: { user: { email: { in: testEmails } } } } } });
    await prisma.consent.deleteMany({ where: { user: { email: { in: testEmails } } } });
    await prisma.userPreference.deleteMany({ where: { user: { email: { in: testEmails } } } });
    await prisma.userSport.deleteMany({ where: { user: { email: { in: testEmails } } } });
    await prisma.deletionRequest.deleteMany({ where: { user: { email: { in: testEmails } } } });
    await prisma.deviceToken.deleteMany({ where: { user: { email: { in: testEmails } } } });
    await prisma.user.deleteMany({ where: { email: { in: testEmails } } });

    // Setup user
    const signupRes = await request(app).post('/auth/signup').send({
      email: 'clubtest@example.com',
      password: 'password123',
      displayName: 'Club Test User',
      termsAccepted: true,
      privacyAccepted: true,
    });
    userId = signupRes.body.user.id;

    const loginRes = await request(app).post('/auth/login').send({
      email: 'clubtest@example.com',
      password: 'password123',
    });
    userToken = loginRes.body.accessToken;

    const sport = await prisma.sport.findFirst();
    sportId = sport!.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await redis.quit();
  });

  it('POST /clubs - Create club', async () => {
    const res = await request(app)
      .post('/clubs')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Test Club',
        description: 'A test club',
        homeArea: 'Seoul',
        sportIds: [sportId],
        visibility: 'PUBLIC',
        joinPolicy: 'OPEN',
      });

    expect(res.status).toBe(201);
    expect(res.body.club.name).toBe('Test Club');
    clubId = res.body.club.id;
  });

  it('GET /clubs - List clubs', async () => {
    const res = await request(app).get('/clubs');
    expect(res.status).toBe(200);
    expect(res.body.clubs.length).toBeGreaterThan(0);
  });

  it('GET /clubs/:id - Detail', async () => {
    const res = await request(app).get(`/clubs/${clubId}`);
    expect(res.status).toBe(200);
    expect(res.body.club.name).toBe('Test Club');
    expect(res.body.club.members.length).toBe(1);
    expect(res.body.club.members[0].userId).toBe(userId);
  });

  it('POST /clubs/:id/join - Join club (OPEN)', async () => {
    const otherEmail = 'clubtest2@example.com';
    await request(app).post('/auth/signup').send({
      email: otherEmail,
      password: 'password123',
      termsAccepted: true,
      privacyAccepted: true,
    });
    const loginRes = await request(app).post('/auth/login').send({
      email: otherEmail,
      password: 'password123',
    });
    const otherToken = loginRes.body.accessToken;

    const res = await request(app)
      .post(`/clubs/${clubId}/join`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(200);
    expect(res.body.member.status).toBe('APPROVED');
  });

  it('Game with clubId', async () => {
    // Need to set onboardingStep to DONE for user
    await prisma.user.update({
      where: { id: userId },
      data: { onboardingStep: 'DONE' },
    });

    const gameRes = await request(app)
      .post('/games')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        sportId,
        clubId,
        title: 'Club Game',
        startTime: new Date(Date.now() + 86400000).toISOString(),
        endTime: new Date(Date.now() + 90000000).toISOString(),
        homeArea: 'Seoul',
        capacity: 10,
      });

    expect(gameRes.status).toBe(201);
    expect(gameRes.body.game.clubId).toBe(clubId);

    const detailRes = await request(app).get(`/games/${gameRes.body.game.id}`);
    expect(detailRes.body.game.club).toBeDefined();
    expect(detailRes.body.game.club.id).toBe(clubId);
  });
});
