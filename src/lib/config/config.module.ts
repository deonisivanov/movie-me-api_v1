import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';

import { app, googleOauth, jwt, mail, redis, typeorm, vonage } from './configs';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.cwd()}/.${process.env.NODE_ENV}.env`, '.env'],
      expandVariables: true,
      load: [typeorm, app, jwt, redis, mail, vonage, googleOauth]
    })
  ],
  providers: [ConfigService],
  exports: [ConfigService]
})
export class ConfigModule {}
