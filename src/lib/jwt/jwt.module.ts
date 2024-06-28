import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Configs>) => ({
        secret: configService.getOrThrow('jwt.secret', { infer: true }),
        signOptions: { expiresIn: configService.getOrThrow('jwt.accessExpire', { infer: true }) }
      })
    })
  ],
  exports: [JwtModule]
})
export class NestJwtModule {}
