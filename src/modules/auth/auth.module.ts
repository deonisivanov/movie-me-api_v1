import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy, JwtAuthStrategy } from './strategies';
import { UsersModule } from '@modules/users';
import { TokensModule } from '@modules/tokens';

import { OtpModule } from '@modules/otp/otp.module';

@Module({
  imports: [UsersModule, PassportModule, TokensModule, OtpModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthStrategy, GoogleStrategy],
  exports: [AuthService]
})
export class AuthModule {}
