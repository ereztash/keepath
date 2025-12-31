import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all apps
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Keepath API')
    .setDescription('The Keepath business management API')
    .setVersion('1.0')
    .addTag('finance')
    .addTag('marketing')
    .addTag('sales')
    .addTag('missions')
    .addTag('team')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4000);
  console.log(`🚀 API Server running on http://localhost:4000`);
  console.log(`📚 API Docs available at http://localhost:4000/api`);
}

bootstrap();
