import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    examples: {
      phone: { summary: 'Phone number', value: '+1234567890' },
      email: { summary: 'Email address', value: 'example@example.com' }
    },
    description: 'User phone number or email address'
  })
  login: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456', description: 'Otp' })
  otp: string;
}
