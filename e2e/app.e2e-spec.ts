import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { initDb } from '../src/scripts/initDb';
import { DateTime } from 'luxon';
import { stringify } from 'qs';

describe('App (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let server: any;
  let refreshToken: string;
  let userId: string;
  let date: string;
  const take = 1;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    server = app.getHttpServer();
    await initDb(app);

    await app.listen(4009);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/health/ping (GET)', () => {
    return request(server)
      .get('/api/health/ping')
      .expect(200)
      .expect((res) => expect(res.body?.data).toBe('OK'));
  });

  it('/api/health (GET)', () => {
    return request(server)
      .get('/api/health')
      .expect(200)
      .expect((res) => {
        expect(res.body?.data?.status).toBe('ok');
      });
  });

  it('/api/auth/register (POST)', () => {
    return request(server)
      .post('/api/auth/register')
      .send({
        username: 'zuj',
        password: '1234',
        email: 'zuj@gmail.com',
        name: 'ZUJ',
      })
      .expect(201)
      .expect((res) => expect(res.body?.data?.username).toBeDefined());
  });

  it('/api/auth/login (POST)', () => {
    return request(server)
      .post('/api/auth/login')
      .send({ username: 'zuj', password: '1234' })
      .expect(201)
      .expect((res) => {
        accessToken = res.body?.data?.accessToken;
        refreshToken = res.body?.data?.refreshToken;
        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();
      });
  });

  it('/api/refresh-token/refresh (POST)', () => {
    return request(server)
      .post('/api/refresh-token/refresh')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refreshToken })
      .expect(201)
      .expect((res) => {
        accessToken = res.body?.data?.accessToken;
        expect(accessToken).toBeDefined();
      });
  });

  it('/api/user/me (GET)', () => {
    return request(server)
      .get('/api/user/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        userId = res.body?.data?.id;
        expect(userId).toBeDefined();
      });
  });

  it('/api/user/me (PUT)', () => {
    return request(server)
      .put('/api/user/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'ZUJ2023', email: 'zuj@gmail.com', phone: '+84 123456789' })
      .expect(200)
      .expect((res) => {
        expect(res.body?.data?.name).toBe('ZUJ2023');
      });
  });

  it('/api/user/me/change-password (PUT)', () => {
    return request(server)
      .put('/api/user/me/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ oldPassword: '1234', newPassword: '12345' })
      .expect(200)
      .expect((res) => {
        expect(res.body?.data).toHaveProperty('id');
      });
  });

  it('/api/fixture/calendar (GET)', () => {
    const from = DateTime.now().startOf('month').toISO();
    const to = DateTime.now().endOf('month').toISO();
    const query = stringify({ from, to });

    return request(server)
      .get(`/api/fixture/calendar?${query}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body?.data?.length).toBeGreaterThan(0);
        date = res.body.data[0];
      });
  });

  it('/api/fixture (GET)', () => {
    const query = stringify({
      type: 'filter',
      filter: {
        kickoffTime: {
          gte: DateTime.fromISO(date).startOf('day').toISO(),
          lte: DateTime.fromISO(date).endOf('day').toISO(),
        },
      },
      skip: 0,
      limit: take,
    });

    return request(server)
      .get(`/api/fixture?${query}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body?.data?.length).toBe(1);
      });
  });
});
