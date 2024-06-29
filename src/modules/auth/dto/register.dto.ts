import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { IsEmailOrPhoneNumberConstraint } from 'src/common/validators/is-login-correct.validator';
import { IsPasswordsMatchingConstraint } from 'src/common/validators/is-passwords-matching.validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Validate(IsEmailOrPhoneNumberConstraint)
  @ApiProperty({
    examples: {
      phone: { summary: 'Phone number', value: '+1234567890' },
      email: { summary: 'Email address', value: 'example@example.com' }
    },
    description: 'User phone number or email address'
  })
  login: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty({
    example: 'password123',
    description: 'User password'
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Validate(IsPasswordsMatchingConstraint)
  @ApiProperty({
    example: 'password123',
    description: 'User password repeat'
  })
  passwordRepeat: string;
}
