import type { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
import { ValidatorConstraint } from 'class-validator';
import type { RegisterDto } from 'src/modules/auth/dto';

@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstraint implements ValidatorConstraintInterface {
  validate(passwordRepeat: string, args: ValidationArguments) {
    const obj = args.object as RegisterDto;
    return obj.password === passwordRepeat;
  }

  defaultMessage() {
    return 'Passwords do not match';
  }
}
