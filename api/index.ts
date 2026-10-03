import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { DomainExceptionFilter } from '../src/infrastructure/adapters/in/http/filters/domain-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const server: Express = express();
let isAppInitialized = false;

async function bootstrapServer(): Promise<Express> {
  if (!isAppInitialized) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.enableCors({
      origin: true,
      credentials: true,
    });

    app.setGlobalPrefix('api');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
      }),
    );

    app.useGlobalFilters(new DomainExceptionFilter());

    // Swagger setup for Vercel
    const config = new DocumentBuilder()
      .setTitle('RPG Party & Master Lore AI - Backend API')
      .setDescription('RPG Party Web Backend on Vercel Serverless')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.init();
    isAppInitialized = true;
  }
  return server;
}

export default async function handler(req: any, res: any) {
  const instance = await bootstrapServer();
  return instance(req, res);
}
