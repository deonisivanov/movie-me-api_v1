import { Module } from '@nestjs/common';

import { NestJwtModule } from '@lib';

import { TokensRepository } from './tokens.repository';
import { TokensService } from './tokens.service';

@Module({
  imports: [NestJwtModule],
  providers: [TokensService, TokensRepository],
  exports: [TokensService]
})
export class TokensModule {}
