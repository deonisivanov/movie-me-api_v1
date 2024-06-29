import { Injectable } from '@nestjs/common';
import { RedisService } from '@songkeys/nestjs-redis';
import type { Redis } from 'ioredis';

import { OTP_CODE_EXPIRE_TIME_MS } from './otp.constants';

@Injectable()
export class OtpRepository {
  private readonly redis: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getClient();
  }

  public async getOtpSession(login: string): Promise<string | null> {
    const otpKey = this.getOtpKey(login);
    const otpData = await this.redis.get(otpKey);

    return otpData ? otpData : null;
  }

  public async saveOtpKey(login: string, otpCode: string): Promise<void> {
    const otpKey = this.getOtpKey(login);
    await this.redis.set(otpKey, otpCode, 'PX', OTP_CODE_EXPIRE_TIME_MS);
  }

  public async deleteOtpKey(login: string): Promise<void> {
    const otpKey = this.getOtpKey(login);
    await this.redis.del(otpKey);
  }

  private getOtpKey(login: string): string {
    return `otp:${login}`;
  }
}
