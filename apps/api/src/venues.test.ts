import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from './index';
import prisma from './lib/db';
import redis from './lib/redis';

describe('Venues API', () => {
  beforeAll(async () => {
    // Seed data is already there from prisma db seed
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await redis.quit();
  });

  it('GET /venues - List venues', async () => {
    const res = await request(app).get('/venues');
    expect(res.status).toBe(200);
    expect(res.body.venues.length).toBeGreaterThan(0);
    expect(res.body.venues[0].sports).toBeDefined();
  });

  it('GET /venues - Filter by sport', async () => {
    const football = await prisma.sport.findUnique({ where: { slug: 'football' } });
    const res = await request(app).get('/venues').query({ sportId: football!.id });
    expect(res.status).toBe(200);
    expect(res.body.venues.every((v: { sports: { slug: string }[] }) => v.sports.some((s: { slug: string }) => s.slug === 'football'))).toBe(true);
  });

  it('GET /venues/:id - Detail', async () => {
    const venue = await prisma.venue.findFirst();
    const res = await request(app).get(`/venues/${venue!.id}`);
    expect(res.status).toBe(200);
    expect(res.body.venue.name).toBe(venue!.name);
  });
});

