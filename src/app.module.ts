import { Module } from '@nestjs/common';
import { ConfigModule, OrmModule, NestRedisModule } from '@lib';
import { AuthModule } from '@modules/auth';
import { UsersModule } from '@modules/users';

@Module({
  imports: [ConfigModule, OrmModule, NestRedisModule, UsersModule, AuthModule]
})
export class AppModule {}
