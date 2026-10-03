import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Themes & RPG System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api/themes (GET) should return available RPG themes and skin catalogs', () => {
    return request(app.getHttpServer())
      .get('/api/themes')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('key');
        expect(res.body[0]).toHaveProperty('races');
        expect(res.body[0]).toHaveProperty('outfitTypes');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
