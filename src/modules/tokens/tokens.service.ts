import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { JwtSignOptions } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

import { TokensRepository } from './tokens.repository';

@Injectable()
export class TokensService {
  private refreshTokenExpiresIn: string | number;
  private accessTokenExpiresIn: string | number;

  constructor(
    private readonly jwtService: JwtService,
    public readonly configService: ConfigService<Configs>,
    private readonly tokensRepository: TokensRepository
  ) {
    this.refreshTokenExpiresIn = this.configService.get('jwt.refreshExpire', { infer: true });
    this.accessTokenExpiresIn = this.configService.get('jwt.accessExpire', { infer: true });
  }

  public async isRefreshTokenSessionExists(sub: string, jti: string): Promise<boolean> {
    const sessionData = await this.tokensRepository.getRefreshTokenSession(sub, jti);
    return !!sessionData;
  }

  public async saveRefreshTokenSession(refreshToken: string) {
    const { sub, exp, jti } = (await this.jwtService.decode(refreshToken, { json: true })) as JwtPayload;
    await this.tokensRepository.saveRefreshSession({ sub, exp, jti });
  }

  public async verify(token: string) {
    const payload = await this.jwtService.verifyAsync(token);
    return payload;
  }

  public async generateTokenPair(
    sub: string,
    payload: AccessTokenPayload
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const jwtid = this.generateJwtId();

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(sub, payload, { jwtid }),
      this.generateRefreshToken(sub, {}, { jwtid })
    ]);

    await this.saveRefreshTokenSession(refreshToken);

    return { accessToken, refreshToken };
  }

  public deleteRefreshTokenSession(sub: string, oldJti: string): Promise<void> {
    return this.tokensRepository.deleteRefreshTokenSession(sub, oldJti);
  }

  private async generateAccessToken(subject: string, payload?: AccessTokenPayload, options?: JwtSignOptions): Promise<string> {
    const jwtSignOptions: JwtSignOptions = {
      subject,
      expiresIn: this.accessTokenExpiresIn,
      ...options
    };

    return await this.jwtService.signAsync(payload, jwtSignOptions);
  }

  private async generateRefreshToken(subject: string, payload?: RefreshTokenPayload, options?: JwtSignOptions): Promise<string> {
    const jwtSignOptions: JwtSignOptions = {
      subject,
      expiresIn: this.refreshTokenExpiresIn,
      ...options
    };

    return await this.jwtService.signAsync(payload || {}, jwtSignOptions);
  }

  private generateJwtId(): string {
    return randomUUID();
  }
}
