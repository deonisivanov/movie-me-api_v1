import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthStrategy } from './strategies';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthStrategy]
})
export class AuthModule {}
