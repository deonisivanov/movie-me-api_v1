import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpRepository } from './otp.repository';
import { MailerService, VonageService } from '@lib';

@Module({
  imports: [],
  providers: [OtpService, OtpRepository, MailerService, VonageService],
  exports: [OtpService, OtpRepository]
})
export class OtpModule {}
