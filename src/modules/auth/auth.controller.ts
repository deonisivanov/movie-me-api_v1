import { Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ResendOtpDto, VerifyOtpDto } from './dto';
import { BaseResolver } from '@lib';
import { Cookie, CurrentUser, GenericController, SwaggerResponse } from 'src/common/decorators';
import { GoogleGuard } from 'src/common/guards';
import { User } from '@entities';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@GenericController('auth', false)
export class AuthController extends BaseResolver {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @SwaggerResponse({
    operation: 'Reset password',
    notFound: "Otp doesn't exist.",
    badRequest: ['Invalid login or password', 'Please verify your account'],
    body: LoginDto
  })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: ExpressResponse) {
    return await this.authService.login(loginDto, response);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto, @Res({ passthrough: true }) response: ExpressResponse) {
    return await this.authService.verifyOtp(verifyOtpDto, response);
  }

  @Post('resend-otp')
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return await this.authService.resendOtp(resendOtpDto);
  }

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
    return this.wrapSuccess({ message: 'Success login via oauth', accessToken: query.token });
  }
}
