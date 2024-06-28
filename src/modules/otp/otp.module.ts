import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpRepository } from './otp.repository';

@Module({
  imports: [],
  providers: [OtpService, OtpRepository],
  exports: [OtpService, OtpRepository]
})
export class OtpModule {}
