import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ConfigModule, NestRedisModule, NestScheduleModule, OrmModule } from '@lib';

import { TimeoutInterceptor } from '@common/interceptors';

import { AuthModule } from '@modules/auth';
import { UsersModule } from '@modules/users';

@Module({
  imports: [ConfigModule, OrmModule, NestRedisModule, UsersModule, AuthModule, NestScheduleModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor
    }
  ]
})
export class AppModule {}
