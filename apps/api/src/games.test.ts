import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from './index';
import prisma from './lib/db';
import redis from './lib/redis';

describe('Games API', () => {
  let token: string;
  let sportId: string;
  const testUser = {
    email: 'test-games-unique@example.com',
    password: 'password123',
    termsAccepted: true,
    privacyAccepted: true,
  };

  const testUser2 = {
    email: 'test-games-2-unique@example.com',
    password: 'password123',
    termsAccepted: true,
    privacyAccepted: true,
  };

  beforeAll(async () => {
    // Cleanup specifically for this test user and related games
    const users = await prisma.user.findMany({ where: { email: { in: [testUser.email, testUser2.email] } } });
    for (const u of users) {
      await prisma.participant.deleteMany({ where: { OR: [{ userId: u.id }, { game: { hostId: u.id } }] } });
      await prisma.gameInvite.deleteMany({ where: { game: { hostId: u.id } } });
      await prisma.game.deleteMany({ where: { hostId: u.id } });
      await prisma.userSport.deleteMany({ where: { userId: u.id } });
      await prisma.userPreference.deleteMany({ where: { userId: u.id } });
      await prisma.notification.deleteMany({ where: { userId: u.id } });
      await prisma.consent.deleteMany({ where: { userId: u.id } });
      await prisma.user.delete({ where: { id: u.id } });
    }
    
    // Create and onboard user
    await request(app).post('/auth/signup').send(testUser);
    const loginRes = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    token = loginRes.body.accessToken;

    const sports = await prisma.sport.findMany();
    sportId = sports[0].id;

    await request(app)
      .put('/user/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({
        homeArea: 'Seoul',
        sports: [{ sportId, level: 'BEGINNER' }]
      });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await redis.quit();
  });

  it('POST /games - Success', async () => {
    const gameData = {
      sportId,
      title: 'Weekend Football',
      description: 'Casual game at Gangnam',
      startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      endTime: new Date(Date.now() + 90000000).toISOString(),
      homeArea: 'Seoul',
      capacity: 10,
    };

    const res = await request(app)
      .post('/games')
      .set('Authorization', `Bearer ${token}`)
      .send(gameData);
    
    expect(res.status).toBe(201);
    expect(res.body.game.title).toBe('Weekend Football');
    expect(res.body.game.participants).toHaveLength(1);
    expect(res.body.game.participants[0].role).toBe('HOST');
  });

  it('GET /games - List with filters', async () => {
    const res = await request(app).get('/games').query({ homeArea: 'Seoul' });
    expect(res.status).toBe(200);
    expect(res.body.games.length).toBeGreaterThan(0);
  });

  it('POST /games/:id/join - Success (Open join policy)', async () => {
    // Create another user
    await request(app).post('/auth/signup').send(testUser2);
    const loginRes2 = await request(app).post('/auth/login').send({ email: testUser2.email, password: testUser2.password });
    const token2 = loginRes2.body.accessToken;
    
    // Onboard user2
    await request(app)
      .put('/user/preferences')
      .set('Authorization', `Bearer ${token2}`)
      .send({ homeArea: 'Seoul', sports: [{ sportId, level: 'BEGINNER' }] });

    // Create a game with host
    const game = await prisma.game.findFirst({ where: { host: { email: testUser.email } } });

    const res = await request(app)
      .post(`/games/${game!.id}/join`)
      .set('Authorization', `Bearer ${token2}`);
    
    expect(res.status).toBe(200);
    expect(res.body.participant.status).toBe('APPROVED');
  });
});

