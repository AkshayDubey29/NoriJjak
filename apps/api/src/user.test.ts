import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from './index';
import prisma from './lib/db';
import redis from './lib/redis';

describe('User Domain API', () => {
  let token: string;
  const testUser = {
    email: 'user-domain@example.com',
    password: 'password123',
    termsAccepted: true,
    privacyAccepted: true,
  };

  beforeAll(async () => {
    const existingUser = await prisma.user.findUnique({ where: { email: testUser.email } });
    if (existingUser) {
      await prisma.userSport.deleteMany({ where: { userId: existingUser.id } });
      await prisma.userPreference.deleteMany({ where: { userId: existingUser.id } });
      await prisma.consent.deleteMany({ where: { userId: existingUser.id } });
      await prisma.notification.deleteMany({ where: { userId: existingUser.id } });
      await prisma.user.delete({ where: { id: existingUser.id } });
    }
    
    await request(app).post('/auth/signup').send(testUser);
    const loginRes = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    token = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await redis.quit();
  });

  it('GET /user/profile - Success', async () => {
    const res = await request(app)
      .get('/user/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.profile.email).toBe(testUser.email);
  });

  it('PUT /user/profile - Success', async () => {
    const res = await request(app)
      .put('/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ displayName: 'John Doe', bio: 'Loves sports' });
    expect(res.status).toBe(200);
    expect(res.body.profile.displayName).toBe('John Doe');
  });

  it('PUT /user/preferences - Success and Onboarding Check', async () => {
    // Get a real sport ID from DB
    const sports = await prisma.sport.findMany();
    const sportId = sports[0].id;

    const res = await request(app)
      .put('/user/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({
        homeArea: 'Seoul',
        preferredRadius: 5,
        sports: [{ sportId, level: 'INTERMEDIATE' }]
      });
    expect(res.status).toBe(200);
    
    // Check onboarding status
    const statusRes = await request(app)
      .get('/user/onboarding-status')
      .set('Authorization', `Bearer ${token}`);
    expect(statusRes.body.status).toBe('DONE');
  });
});

