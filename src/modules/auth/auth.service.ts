import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PasswordUtils } from 'src/utils';

import { BaseResolver } from '@lib';

import { OtpService } from '@modules/otp';
import { TokensService } from '@modules/tokens';
import { UsersService } from '@modules/users';

import type { User } from '@entities';

import type { LoginDto, RegisterDto, ResendOtpDto, VerifyOtpDto } from './dto';

@Injectable()
export class AuthService extends BaseResolver {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    private readonly tokensService: TokensService
  ) {
    super();
  }

  public async login(loginDto: LoginDto, response: ExpressResponse): Promise<{ accessToken: string }> {
    const { login, password } = loginDto;
    const existUser = await this.usersService.findOneByLogin(login);

    if (!existUser) {
      this.logger.warn(`Failed login attempt for user: ${login}`);
      throw new NotFoundException(this.wrapFail('User not found'));
    }

    if (!(await PasswordUtils.verifyPassword(password, existUser.password))) {
      this.logger.warn(`Failed login attempt for user: ${login}`);
      throw new BadRequestException(this.wrapFail('Invalid login or password'));
    }

    if (!existUser.verified) {
      this.logger.warn(`Failed login attempt for unverified user: ${login}`);
      throw new BadRequestException(this.wrapFail('Please verify your account', { needVerify: true }));
    }

    return this.generateTokensAndSetCookie(existUser, response);
  }

  public async register(registerDto: RegisterDto): Promise<{ retryDelay: number }> {
    await this.checkUserExistence(registerDto.login, false);
    await this.usersService.createUser(registerDto);
    const result = await this.otpService.sendOtp(registerDto.login);

    this.logger.log(`OTP sent to ${registerDto.login}`);

    return this.wrapSuccess(result);
  }

  public async verifyOtp(verifyOtpDto: VerifyOtpDto, response: ExpressResponse): Promise<{ accessToken: string }> {
    const { login, otp } = verifyOtpDto;

    const existUser = await this.checkUserExistence(login, true);
    await this.otpService.verifyOtp(login, otp);

    await this.usersService.verifyUser(existUser.id);
    this.logger.log(`User ${existUser.login} verified`);

    return this.generateTokensAndSetCookie(existUser, response, true);
  }

  public async resendOtp(resendOtpDto: ResendOtpDto): Promise<{ retryDelay: number }> {
    await this.checkUserExistence(resendOtpDto.login, true);
    const result = await this.otpService.sendOtp(resendOtpDto.login);

    this.logger.log(`OTP sent to ${resendOtpDto.login}`);

    return this.wrapSuccess(result);
  }

  public async refreshTokens(incomingRefreshToken: string, response: ExpressResponse): Promise<{ accessToken: string }> {
    const { sub, jti } = await this.tokensService.verify(incomingRefreshToken);

    const refreshSessionExists = await this.tokensService.isRefreshTokenSessionExists(sub, jti);
    if (!refreshSessionExists) {
      throw new BadRequestException(this.wrapFail('Invalid refresh token'));
    }

    const userFromToken = await this.usersService.findOneById(sub);
    if (!userFromToken) {
      throw new BadRequestException(this.wrapFail('User not found'));
    }

    await this.tokensService.deleteRefreshTokenSession(sub, jti);
    return this.generateTokensAndSetCookie(userFromToken, response, true);
  }

  public async OauthHandler(userId: string, response: ExpressResponse) {
    const { accessToken } = await this.generateTokensAndSetCookie({ id: userId, verified: false }, response, true);
    return response.redirect(`${process.env.APP_URL}/auth/oauth/login?token=${accessToken}`);
  }

  private async generateTokensAndSetCookie(
    user: Pick<User, 'id' | 'verified'>,
    response: ExpressResponse,
    verified?: boolean
  ): Promise<{ accessToken: string }> {
    const tokens = await this.tokensService.generateTokenPair(user.id, {
      verified: verified ?? user.verified
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'strict' as const
    };

    response.cookie('refreshToken', tokens.refreshToken, cookieOptions);

    return this.wrapSuccess({ accessToken: tokens.accessToken });
  }

  private async checkUserExistence(login: string, shouldExist: boolean = false): Promise<User> {
    const existUser = await this.usersService.findOneByLogin(login);

    if (shouldExist && !existUser) {
      this.logger.warn(`User with login ${login} not found`);
      throw new BadRequestException(this.wrapFail('User not found'));
    }

    if (!shouldExist && existUser) {
      this.logger.warn(`User with login ${login} already exists`);
      throw new BadRequestException(this.wrapFail('User with this login already exists'));
    }

    return existUser;
  }
}
