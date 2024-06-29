import { Body, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Cookie, CurrentUser, GenericController, SwaggerResponse } from 'src/common/decorators';
import { GoogleGuard } from 'src/common/guards';

import { User } from '@entities';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ResendOtpDto, VerifyOtpDto } from './dto';

@GenericController('Auth', false)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @SwaggerResponse({
    operation: 'User login',
    badRequest: ['Invalid login or password', 'Please verify your account'],
    notFound: 'User not found',
    body: LoginDto,
    response: { accessToken: 'string' }
  })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: ExpressResponse) {
    return await this.authService.login(loginDto, response);
  }

  @Post('register')
  @SwaggerResponse({
    operation: 'User registration',
    badRequest: ['User with this login already exists'],
    body: RegisterDto,
    response: { retryDelay: 123456 }
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @SwaggerResponse({
    operation: 'Verify OTP',
    badRequest: ['User with this login already exists', 'OTP session not found', 'Invalid OTP code'],
    notFound: 'User not found',
    body: VerifyOtpDto,
    response: { retryDelay: 123456 }
  })
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto, @Res({ passthrough: true }) response: ExpressResponse) {
    return await this.authService.verifyOtp(verifyOtpDto, response);
  }

  @SwaggerResponse({
    operation: 'Resend OTP',
    badRequest: ['User with this login already exists', 'OTP session not found', 'Invalid OTP code'],
    notFound: 'User not found',
    body: ResendOtpDto,
    response: { retryDelay: 123456 }
  })
  @Post('resend-otp')
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return await this.authService.resendOtp(resendOtpDto);
  }

  @SwaggerResponse({
    operation: 'Refresh tokens',
    badRequest: ['Invalid refresh token'],
    notFound: 'User not found',
    response: { accessToken: 'string' }
  })
  @Post('refresh')
  async refresh(@Cookie('refreshToken') refreshToken: string, @Res({ passthrough: true }) response: ExpressResponse) {
    return await this.authService.refreshTokens(refreshToken, response);
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  googleAuth() {
    // the google auth redirect will be handled by passport
  }

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(@CurrentUser() user: User, @Res() response: ExpressResponse) {
    return await this.authService.OauthHandler(user.id, response);
  }

  @Get('oauth/login')
  oauthMock(@Query() query: QueryTokenOauth2) {
    return { accessToken: query.token };
  }
}
