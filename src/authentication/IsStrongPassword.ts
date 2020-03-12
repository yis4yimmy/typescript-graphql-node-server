import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator
} from "class-validator";

const uppercaseAlpha = "(?=.*[A-Z])";
const lowercaseAlpha = "(?=.*[a-z])";
const numeric = "(?=.*[0-9])";
const allowedSpecialCharacters = "!@#$%^&*";
const specialCharacter = `(?=.*[${allowedSpecialCharacters}])`;
const strongPassword = new RegExp(
  `^(${lowercaseAlpha}${uppercaseAlpha}${numeric})|(${lowercaseAlpha}${uppercaseAlpha}${specialCharacter})|(${lowercaseAlpha}${uppercaseAlpha}${numeric}${specialCharacter})`
);

@ValidatorConstraint({ async: false })
export class IsStrongPasswordConstraint
  implements ValidatorConstraintInterface {
  validate(password: string) {
    return strongPassword.test(password);
  }

  defaultMessage() {
    return `password must contain at least one upper and lowercase letter and at least one number or special character (${allowedSpecialCharacters})`;
  }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint
    });
  };
}
