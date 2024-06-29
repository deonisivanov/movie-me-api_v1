import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ResendOtpDto, VerifyOtpDto } from './dto';
import { BaseResolver } from '@lib';

@Controller('auth')
export class AuthController extends BaseResolver {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: ExpressResponse) {
    const tokens = await this.authService.login(loginDto);

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });

    return this.wrapSuccess({ accessToken: tokens.accessToken });
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto, @Res({ passthrough: true }) response: ExpressResponse) {
    const tokens = await this.authService.verifyOtp(verifyOtpDto);

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });

    return this.wrapSuccess({ accessToken: tokens.accessToken });
  }

  @Post('resend-otp')
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return await this.authService.resendOtp(resendOtpDto);
  }
}
