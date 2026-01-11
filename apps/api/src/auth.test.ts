import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from './index';
import prisma from './lib/db';
import redis from './lib/redis';

describe('Auth API', () => {
  const testUser = {
    email: 'test-auth-unique@example.com',
    password: 'password123',
    termsAccepted: true,
    privacyAccepted: true,
  };

  beforeAll(async () => {
    // Clean up
    await prisma.consent.deleteMany({ where: { user: { email: testUser.email } } });
    await prisma.deletionRequest.deleteMany({ where: { user: { email: testUser.email } } });
    await prisma.user.deleteMany({ where: { email: testUser.email } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await redis.quit();
  });

  it('POST /auth/signup - Success', async () => {
    const res = await request(app).post('/auth/signup').send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User created');
  });

  it('POST /auth/login - Success', async () => {
    const res = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('GET /auth/me - Success (Protected)', async () => {
    const loginRes = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    const token = loginRes.body.accessToken;

    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.user.consents).toHaveLength(2);
  });

  it('POST /auth/logout - Success', async () => {
    const loginRes = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    const token = loginRes.body.accessToken;

    const res = await request(app)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logged out');

    // Verify revoked
    const meRes = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(meRes.status).toBe(401);
  });
});

