import { BadRequestException, Injectable } from '@nestjs/common';
import { OtpRepository } from './otp.repository';

@Injectable()
export class OtpService {
  constructor(private readonly otpRepository: OtpRepository) {}

  public async isOtpSessionExists(login: string): Promise<boolean> {
    const sessionData = await this.otpRepository.getOtpSession(login);
    return !!sessionData;
  }

  public async sendOtpCode(login: string) {
    const otpSessionData = await this.otpRepository.getOtpSession(login);
    if (otpSessionData) {
      throw new BadRequestException('Test error');
    }

    const otpCode = this.createOtpCode();
    await this.otpRepository.saveOtpKey(login, otpCode);

    return `Your verification code is ${otpCode}`;
  }

  public async verifyOtpCode(login: string, otpCode: string) {
    const otpSessionData = await this.otpRepository.getOtpSession(login);
    if (!otpSessionData) {
      throw new BadRequestException('Otp session not found');
    }

    if (otpCode !== otpSessionData) {
      throw new BadRequestException('Invalid otp code');
    }

    await this.otpRepository.deleteOtpKey(login);
  }

  public async resendOtpCode() {}

  private createOtpCode(): string {
    const min = 100000;
    const max = 999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber.toString();
  }
}
