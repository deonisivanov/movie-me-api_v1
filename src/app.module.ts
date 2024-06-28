import { Module } from '@nestjs/common';
import { ConfigModule, OrmModule, NestRedisModule } from '@lib';

@Module({
  imports: [ConfigModule, OrmModule, NestRedisModule]
})
export class AppModule {}
