import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { type Profile, Strategy, type VerifyCallback } from 'passport-google-oauth20';
import { PasswordUtils } from 'src/utils';

import { UsersService } from '@modules/users';

import type { User } from '@entities';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    public readonly configService: ConfigService<Configs>,
    private readonly usersSerivce: UsersService
  ) {
    super({
      clientID: configService.get('googleOauth.clientId', { infer: true }),
      clientSecret: configService.get('googleOauth.secret', { infer: true }),
      callbackURL: configService.get('googleOauth.callbackUrl', { infer: true }),
      scope: ['email', 'profile']
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) {
    const { emails } = profile;

    const user: Partial<User> = {
      login: emails![0]!.value
    };

    const existingUser = await this.usersSerivce.findOneByLogin(user.login);

    if (existingUser) {
      done(undefined, existingUser);
    } else {
      const newUser = await this.usersSerivce.createUser({
        login: user.login,
        password: await PasswordUtils.generateAndHashPassword(),
        verified: true
      });

      done(undefined, newUser);
    }
  }
}
