import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokensService } from 'src/modules/tokens';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    public readonly configService: ConfigService<Configs>,
    private readonly tokensService: TokensService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('jwt.secret', { infer: true })
    });
  }

  async validate(payload: JwtPayload): Promise<AccessTokenPayload> {
    const { sub, jti, verified } = payload;

    const refreshSessionExists = await this.tokensService.isRefreshTokenSessionExists(sub, jti);
    if (!refreshSessionExists || !verified) {
      throw new UnauthorizedException();
    }

    return {
      verified
    };
  }
}
