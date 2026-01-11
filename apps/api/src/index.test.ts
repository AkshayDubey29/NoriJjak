import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './index';

describe('API Skeleton', () => {
  it('GET /health returns ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('GET /version returns correct info', async () => {
    const response = await request(app).get('/version');
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('NORIJJAK');
    expect(response.body.version).toBe('0.1.0');
  });
});

