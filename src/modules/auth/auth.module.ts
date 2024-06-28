import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthStrategy } from './strategies';
import { UsersModule } from '@modules/users';
import { TokensModule } from '@modules/tokens';

@Module({
  imports: [UsersModule, PassportModule, TokensModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthStrategy],
  exports: [AuthService]
})
export class AuthModule {}
