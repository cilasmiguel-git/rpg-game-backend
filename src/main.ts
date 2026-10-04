import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DomainExceptionFilter } from './infrastructure/adapters/in/http/filters/domain-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração flexível de CORS (origens permitidas via .env ou padrões de desenvolvimento)
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
      ];

  app.enableCors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (como Postman, ferramentas locais) ou se bater na lista permitida / desenvolvimento
      if (
        !origin ||
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== 'production'
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Origem CORS não permitida: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With'],
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

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('RPG Party & Master Lore AI - Backend API')
    .setDescription(
      'Backend em Arquitetura Hexagonal com NestJS, Prisma e MongoDB para sessões de RPG com amigos, criação visual de personagens, temáticas customizadas e fases com suporte narrativo e geração de imagens por IA.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Autenticação & Acesso à Sala')
    .addTag('Parties & Sessões de RPG')
    .addTag('Temáticas de RPG & Skins Pré-definidas')
    .addTag('Criação Visual de Personagens & Skins')
    .addTag('Fases do RPG & Narrativa com IA & Imagens')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`⚔️  RPG Backend rodando em: http://localhost:${port}/api`);
  console.log(`📜 Documentação Swagger interativa: http://localhost:${port}/docs`);
}
bootstrap();
