import type { ValidatorConstraintInterface } from 'class-validator';
import { isEmail, isPhoneNumber, ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ name: 'isEmailOrPhoneNumber', async: false })
export class IsEmailOrPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return isEmail(value) || isPhoneNumber(value);
  }

  defaultMessage() {
    return 'Value must be either an email or a phone number';
  }
}
