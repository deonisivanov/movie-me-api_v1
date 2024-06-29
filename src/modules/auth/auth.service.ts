import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { RegisterDto, ResendOtpDto, VerifyOtpDto } from './dto';
import { UsersService } from '@modules/users';
import { BaseResolver } from '@lib';
import { OtpService } from '@modules/otp';
import { TokensService } from '@modules/tokens';

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

  public async register(registerDto: RegisterDto): Promise<void> {
    const existUser = await this.usersService.findOneByLogin(registerDto.login);
    if (existUser) {
      this.logger.warn(`Registration attempt with existing login: ${registerDto.login}`);
      throw new BadRequestException(this.wrapFail('User with this login already exists'));
    }

    await this.usersService.createUser(registerDto);
    await this.otpService.sendOtp(registerDto.login);

    this.logger.log(`User registered and OTP sent to ${registerDto.login}`);
  }

  public async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { login, otp } = verifyOtpDto;

    await this.otpService.verifyOtp(login, otp);

    const existUser = await this.usersService.findOneByLogin(login);
    if (!existUser) {
      this.logger.warn(`Verification attempt for non-existent user: ${login}`);
      throw new BadRequestException(this.wrapFail('User not found'));
    }

    await this.usersService.verifyUser(existUser.id);

    const tokens = await this.tokensService.generateTokenPair(existUser.id, {
      id: existUser.id,
      verified: true
    });

    this.logger.log(`User ${existUser.login} verified and tokens generated`);
    return tokens;
  }

  public async resendOtp(resendOtpDto: ResendOtpDto): Promise<void> {
    const existUser = await this.usersService.findOneByLogin(resendOtpDto.login);
    if (!existUser) {
      this.logger.warn(`OTP resend attempt for non-existent user: ${resendOtpDto.login}`);
      throw new BadRequestException(this.wrapFail('User not found'));
    }

    await this.otpService.sendOtp(resendOtpDto.login);
    this.logger.log(`OTP resent to ${resendOtpDto.login}`);
  }
}
