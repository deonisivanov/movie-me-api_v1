import { Module } from '@nestjs/common';
import { ConfigModule, OrmModule, NestRedisModule, NestScheduleModule } from '@lib';
import { AuthModule } from '@modules/auth';
import { UsersModule } from '@modules/users';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TimeoutInterceptor } from '@common/interceptors';

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
