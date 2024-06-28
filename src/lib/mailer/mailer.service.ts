import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { SendMailOptions, Transporter } from 'nodemailer';
import { createTransport } from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly transporter: Transporter;
  private readonly defaultMailOptions: SendMailOptions;

  constructor(private configService: ConfigService<Configs>) {
    this.transporter = createTransport({
      host: configService.get('mail.host', { infer: true }),
      port: configService.get('mail.port', { infer: true }),
      secure: false,
      auth: {
        user: configService.get('mail.auth.user', { infer: true }),
        pass: configService.get('mail.auth.pass', { infer: true }),
      },
    });

    this.defaultMailOptions = {
      from: {
        name: this.configService.get('app.name', { infer: true }),
        address: this.configService.get('mail.senderEmail', { infer: true }),
      },
    };
  }

  public async sendMail(to: string, code: string): Promise<void> {
    const mailOptions = {
      ...this.defaultMailOptions,
      to,
      subject: `Активация аккаунт`,
      text: ``,
      html: `<p>Please activate your account using this ${code}</p>`,
    };

    try {
      this.logger.log(`Email sent to ${to} with activation code ${code}`);
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
