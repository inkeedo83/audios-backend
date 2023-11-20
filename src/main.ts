import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors();
  app.use('/assets', express.static(join(__dirname, 'assets')));
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Audios API')
    .setDescription('Audios api')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document);

  await app.listen(5010);
}
bootstrap();
