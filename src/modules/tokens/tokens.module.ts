import { Module } from '@nestjs/common';
import { NestJwtModule } from '@lib/index';

@Module({
  imports: [NestJwtModule],
  providers: [],
  exports: []
})
export class TokensModule {}
