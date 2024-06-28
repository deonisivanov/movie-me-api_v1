import { BaseResolver } from '@lib';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

@Controller('auth')
export class AuthController extends BaseResolver {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {}
}
