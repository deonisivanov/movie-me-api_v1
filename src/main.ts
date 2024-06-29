import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AppUtils } from './utils/app/app.utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<Configs>);

  const port = configService.getOrThrow('app.port', { infer: true });

  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  AppUtils.setupSwagger(app, configService);

  console.log('🚀 Application is running on port: ' + port);

  await app.listen(port);
}

bootstrap();
