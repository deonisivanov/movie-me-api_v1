import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { BaseResolver } from '@lib';
import { OTP_CODE_EXPIRE_TIME_MS } from './otp.constants';

@Injectable()
export class OtpService extends BaseResolver {
  private readonly logger = new Logger(OtpService.name);

  constructor(private readonly otpRepository: OtpRepository) {
    super();
  }

  public async isOtpSessionExists(login: string): Promise<boolean> {
    const sessionData = await this.otpRepository.getOtpSession(login);
    return !!sessionData;
  }

  public async sendOtp(login: string) {
    const otpSessionData = await this.otpRepository.getOtpSession(login);
    if (otpSessionData) {
      this.logger.warn(`Attempt to send OTP for existing session: ${login}`);
      throw new BadRequestException(this.wrapFail('OTP session already exists'));
    }

    const otp = this.createOtp();
    await this.otpRepository.saveOtpKey(login, otp);

    return this.wrapSuccess({ retryDelay: OTP_CODE_EXPIRE_TIME_MS });
  }

  public async verifyOtp(login: string, otp: string) {
    const otpSessionData = await this.otpRepository.getOtpSession(login);
    if (!otpSessionData) {
      this.logger.warn(`OTP verification attempt for non-existent session: ${login}`);
      throw new BadRequestException(this.wrapFail('OTP session not found'));
    }

    if (otp !== otpSessionData) {
      this.logger.warn(`Invalid OTP attempt for ${login}`);
      throw new BadRequestException(this.wrapFail('Invalid OTP code'));
    }

    await this.otpRepository.deleteOtpKey(login);
  }

  private createOtp(): string {
    const min = 100000;
    const max = 999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber.toString();
  }
}
