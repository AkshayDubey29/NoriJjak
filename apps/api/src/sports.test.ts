import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from './index';
import prisma from './lib/db';

describe('Sports API', () => {
  beforeAll(async () => {
    // Seed is assumed to have run
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('GET /sports - Success', async () => {
    const res = await request(app).get('/sports');
    expect(res.status).toBe(200);
    expect(res.body.sports).toBeDefined();
    expect(res.body.sports.length).toBeGreaterThan(0);
    expect(res.body.sports[0]).toHaveProperty('slug');
    expect(res.body.sports[0]).toHaveProperty('name_ko');
    expect(res.body.sports[0]).toHaveProperty('name_en');
  });
});

