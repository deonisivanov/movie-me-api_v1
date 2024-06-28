import { Injectable } from '@nestjs/common';
import { RedisService } from '@songkeys/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class TokensRepository {
  private readonly redis: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getClient();
  }

  public async getRefreshTokenSession(sub: string, jti: string): Promise<Record<string, unknown> | null> {
    const sessionKey = this.getRefreshTokenSessionKey(sub, jti);
    const sessionData = await this.redis.get(sessionKey);

    return sessionData ? JSON.parse(sessionData) : null;
  }

  public async saveRefreshSession({ sub, exp, jti }: JwtPayload, sessionData: Record<string, unknown> = {}): Promise<void> {
    const sessionKey = this.getRefreshTokenSessionKey(sub, jti);
    await this.redis.set(sessionKey, JSON.stringify(sessionData), 'EXAT', exp);
  }

  public async deleteRefreshTokenSession(sub: string, jti: string): Promise<void> {
    const sessionKey = this.getRefreshTokenSessionKey(sub, jti);
    await this.redis.del(sessionKey);
  }

  private getRefreshTokenSessionKey(sub: string, jti: string): string {
    return `user:${sub}:jti:${jti}`;
  }
}
