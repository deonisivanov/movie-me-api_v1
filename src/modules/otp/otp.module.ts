import { Module } from '@nestjs/common';

import { MailerService, VonageService } from '@lib';

import { OtpRepository } from './otp.repository';
import { OtpService } from './otp.service';

@Module({
  imports: [],
  providers: [OtpService, OtpRepository, MailerService, VonageService],
  exports: [OtpService, OtpRepository]
})
export class OtpModule {}
