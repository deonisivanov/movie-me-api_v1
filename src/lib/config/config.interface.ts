import type { ConfigType } from '@nestjs/config';

import type { app, googleOauth, jwt, mail, redis, typeorm, vonage } from './configs';

export interface Config {
  app: ConfigType<typeof app>;
  typeorm: ConfigType<typeof typeorm>;
  jwt: ConfigType<typeof jwt>;
  redis: ConfigType<typeof redis>;
  mail: ConfigType<typeof mail>;
  vonage: ConfigType<typeof vonage>;
  googleOauth: ConfigType<typeof googleOauth>;
}
