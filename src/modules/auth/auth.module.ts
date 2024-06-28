import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthStrategy } from './strategies';
import { UsersModule } from '@modules/users';
import { TokensModule } from '@modules/tokens';
import { OtpService } from '@modules/otp';
import { OtpModule } from '@modules/otp/otp.module';

@Module({
  imports: [UsersModule, PassportModule, TokensModule, OtpModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthStrategy],
  exports: [AuthService]
})
export class AuthModule {}
