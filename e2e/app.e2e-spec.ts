import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let server: any;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    server = app.getHttpServer();

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

  it('/api/auth/refresh-token (POST)', () => {
    return request(server)
      .post('/api/auth/refresh-token')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})
      .expect(201)
      .expect((res) => {
        expect(res.body?.data?.accessToken).toBeDefined();
      });
  });
});
