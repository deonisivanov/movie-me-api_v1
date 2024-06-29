import { BaseResolver } from '@lib';
import { OtpService } from '@modules/otp';
import { TokensService } from '@modules/tokens';
import { UsersService } from '@modules/users';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { LoginDto, RegisterDto, ResendOtpDto, VerifyOtpDto } from './dto';
import { PasswordUtils } from 'src/utils';

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

  public async login(loginDto: LoginDto) {
    const existUser = await this.usersService.findOneByLogin(loginDto.login);
    const isPasswordValid = await PasswordUtils.verifyPassword(loginDto.password, existUser.password);

    if (!isPasswordValid) {
      throw new BadRequestException(this.wrapFail('Invalid login or password'));
    }

    const tokens = await this.tokensService.generateTokenPair(existUser.id, {
      id: existUser.id,
      verified: existUser.verified
    });

    return tokens;
  }

  public async register(registerDto: RegisterDto) {
    const existUser = await this.usersService.findOneByLogin(registerDto.login);
    if (existUser) {
      this.logger.warn(`Registration attempt with existing login: ${registerDto.login}`);
      throw new BadRequestException(this.wrapFail('User with this login already exists'));
    }

    await this.usersService.createUser(registerDto);

    return await this.otpService.sendOtp(registerDto.login);
  }

  public async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { login, otp } = verifyOtpDto;

    await this.otpService.verifyOtp(login, otp);
    const existUser = await this.checkUserExistence(login, true);

    await this.usersService.verifyUser(existUser.id);

    const tokens = await this.tokensService.generateTokenPair(existUser.id, {
      id: existUser.id,
      verified: true
    });

    this.logger.log(`User ${existUser.login} verified and tokens generated`);

    return tokens;
  }

  public async resendOtp(resendOtpDto: ResendOtpDto) {
    await this.checkUserExistence(resendOtpDto.login, true);
    this.logger.log(`OTP resent to ${resendOtpDto.login}`);

    return await this.otpService.sendOtp(resendOtpDto.login);
  }

  private async checkUserExistence(login: string, shouldExist: boolean = false) {
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
