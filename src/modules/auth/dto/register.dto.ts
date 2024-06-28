import { IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { IsEmailOrPhoneNumberConstraint } from 'src/common/validators/is-login-correct.validator';
import { IsPasswordsMatchingConstraint } from 'src/common/validators/is-passwords-matching.validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Validate(IsEmailOrPhoneNumberConstraint)
  login: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Validate(IsPasswordsMatchingConstraint)
  passwordRepeat: string;
}
