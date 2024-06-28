import { Module } from '@nestjs/common';

import { NestJwtModule } from '@lib';

import { TokensService } from './tokens.service';
import { TokensRepository } from './tokens.repository';

@Module({
  imports: [NestJwtModule],
  providers: [TokensService, TokensRepository],
  exports: [TokensService]
})
export class TokensModule {}
