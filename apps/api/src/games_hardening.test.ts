import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from './index';
import prisma from './lib/db';
import redis from './lib/redis';

describe('Games Hardening API', () => {
  let hostToken: string;
  let userToken: string;
  let sportId: string;

  beforeAll(async () => {
    // Unique emails for this test file
    const hostEmail = 'host-hardening@example.com';
    const userEmail = 'user-hardening@example.com';

    await prisma.notification.deleteMany({ where: { user: { email: { in: [hostEmail, userEmail] } } } });
    await prisma.participant.deleteMany({ where: { user: { email: { in: [hostEmail, userEmail] } } } });
    await prisma.gameInvite.deleteMany({ where: { game: { host: { email: hostEmail } } } });
    await prisma.game.deleteMany({ where: { host: { email: hostEmail } } });
    await prisma.userSport.deleteMany({ where: { user: { email: { in: [hostEmail, userEmail] } } } });
    await prisma.userPreference.deleteMany({ where: { user: { email: { in: [hostEmail, userEmail] } } } });
    await prisma.consent.deleteMany({ where: { user: { email: { in: [hostEmail, userEmail] } } } });
    await prisma.deletionRequest.deleteMany({ where: { user: { email: { in: [hostEmail, userEmail] } } } });
    await prisma.deviceToken.deleteMany({ where: { user: { email: { in: [hostEmail, userEmail] } } } });
    await prisma.user.deleteMany({ where: { email: { in: [hostEmail, userEmail] } } });
    
    // Create host
    await request(app).post('/auth/signup').send({
      email: hostEmail, password: 'password123', termsAccepted: true, privacyAccepted: true
    });
    const hostLogin = await request(app).post('/auth/login').send({ email: hostEmail, password: 'password123' });
    hostToken = hostLogin.body.accessToken;

    // Create user
    await request(app).post('/auth/signup').send({
      email: userEmail, password: 'password123', termsAccepted: true, privacyAccepted: true
    });
    const userLogin = await request(app).post('/auth/login').send({ email: userEmail, password: 'password123' });
    userToken = userLogin.body.accessToken;

    const sports = await prisma.sport.findMany();
    sportId = sports[0].id;

    // Onboard both
    await request(app).put('/user/preferences').set('Authorization', `Bearer ${hostToken}`).send({ homeArea: 'Seoul', sports: [{ sportId, level: 'BEGINNER' }] });
    await request(app).put('/user/preferences').set('Authorization', `Bearer ${userToken}`).send({ homeArea: 'Seoul', sports: [{ sportId, level: 'BEGINNER' }] });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await redis.quit();
  });

  it('APPROVAL join policy flow', async () => {
    // 1. Host creates game with APPROVAL policy
    const gameRes = await request(app)
      .post('/games')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        sportId, title: 'Approval Game', startTime: new Date(Date.now() + 86400000).toISOString(),
        endTime: new Date(Date.now() + 90000000).toISOString(), homeArea: 'Seoul', capacity: 2, joinPolicy: 'APPROVAL'
      });
    const gameId = gameRes.body.game.id;

    // 2. User joins - status should be REQUESTED
    const joinRes = await request(app)
      .post(`/games/${gameId}/join`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(joinRes.body.participant.status).toBe('REQUESTED');

    // 3. Host sees notification
    const hostNotifs = await request(app).get('/notifications').set('Authorization', `Bearer ${hostToken}`);
    expect(hostNotifs.body.notifications[0].type).toBe('GAME_REQUEST');

    // 4. Host approves user
    const participantId = joinRes.body.participant.id;
    await request(app)
      .post(`/games/${gameId}/participants/${participantId}/approve`)
      .set('Authorization', `Bearer ${hostToken}`);
    
    const checkParticipant = await prisma.participant.findUnique({ where: { id: participantId } });
    expect(checkParticipant?.status).toBe('APPROVED');

    // 5. User sees notification
    const userNotifs = await request(app).get('/notifications').set('Authorization', `Bearer ${userToken}`);
    expect(userNotifs.body.notifications[0].type).toBe('GAME_APPROVED');
  });

  it('PRIVATE game with invite token', async () => {
    // 1. Host creates PRIVATE game
    const gameRes = await request(app)
      .post('/games')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        sportId, title: 'Private Game', startTime: new Date(Date.now() + 86400000).toISOString(),
        endTime: new Date(Date.now() + 90000000).toISOString(), homeArea: 'Seoul', capacity: 5, visibility: 'PRIVATE'
      });
    const gameId = gameRes.body.game.id;

    // 2. User tries to join without token - should fail
    const failJoin = await request(app).post(`/games/${gameId}/join`).set('Authorization', `Bearer ${userToken}`);
    expect(failJoin.status).toBe(403);

    // 3. Host creates invite token
    const inviteRes = await request(app)
      .post(`/games/${gameId}/invites`)
      .set('Authorization', `Bearer ${hostToken}`)
      .send({ maxUses: 1 });
    const token = inviteRes.body.invite.token;

    // 4. User joins with token - success
    const successJoin = await request(app)
      .post(`/games/${gameId}/join`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ inviteToken: token });
    expect(successJoin.status).toBe(200);
  });

  it('Pagination in games list', async () => {
    // Create several games
    for (let i = 0; i < 5; i++) {
      await request(app).post('/games').set('Authorization', `Bearer ${hostToken}`).send({
        sportId, title: `Game ${i}`, startTime: new Date(Date.now() + 86400000 + i * 1000).toISOString(),
        endTime: new Date(Date.now() + 90000000).toISOString(), homeArea: 'Seoul', capacity: 10
      });
    }

    const res1 = await request(app).get('/games').query({ limit: 2 });
    expect(res1.body.games).toHaveLength(2);
    expect(res1.body.nextCursor).toBeDefined();

    const res2 = await request(app).get('/games').query({ limit: 2, cursor: res1.body.nextCursor });
    expect(res2.body.games).toHaveLength(2);
    expect(res2.body.games[0].id).not.toBe(res1.body.games[0].id);
  });

  it('Game with venueId', async () => {
    const venue = await prisma.venue.findFirst();
    const gameRes = await request(app)
      .post('/games')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        sportId, title: 'Venue Game', startTime: new Date(Date.now() + 86400000).toISOString(),
        endTime: new Date(Date.now() + 90000000).toISOString(), homeArea: 'Seoul', capacity: 10,
        venueId: venue!.id
      });
    
    expect(gameRes.status).toBe(201);
    expect(gameRes.body.game.venueId).toBe(venue!.id);

    const detailRes = await request(app).get(`/games/${gameRes.body.game.id}`);
    expect(detailRes.body.game.venue).toBeDefined();
    expect(detailRes.body.game.venue.id).toBe(venue!.id);
  });
});

