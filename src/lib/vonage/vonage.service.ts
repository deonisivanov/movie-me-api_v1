import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth } from '@vonage/auth';
import { Vonage } from '@vonage/server-sdk';
import { BaseResolver } from '../base';

@Injectable()
export class VonageService extends BaseResolver {
  private readonly vonage: Vonage;
  private readonly logger = new Logger(VonageService.name);

  constructor(public readonly configService: ConfigService<Configs>) {
    super();

    const auth = new Auth({
      apiKey: configService.get('vonage.apiKey', { infer: true }),
      apiSecret: configService.get('vonage.apiSecret', { infer: true })
    });

    this.vonage = new Vonage(auth);
  }

  async sendSms(to: string, text: string): Promise<void> {
    try {
      const responseData = await this.vonage.sms.send({
        to,
        from: this.configService.get('vonage.from', { infer: true }),
        text
      });

      if (responseData.messages[0].status !== '0') {
        this.logger.error(`Failed to send SMS to ${to}: ${responseData.messages[0]['error-text']}`);
        throw new BadRequestException(this.wrapFail('OtpErrors.FAILED_SEND_OTP'));
      }

      this.logger.log(`SMS sent to ${to}: ${text}`);
    } catch (err) {
      this.logger.error(`Failed to send SMS to ${to}`, err.stack);
      throw new BadRequestException(this.wrapFail('OtpErrors.FAILED_SEND_OTP'));
    }
  }
}
