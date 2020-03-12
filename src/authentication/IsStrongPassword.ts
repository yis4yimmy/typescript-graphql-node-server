import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator
} from "class-validator";

const allowedSpecialCharacters = "!@#$%^&*";
const validCharacters = `[a-zA-Z0-9${allowedSpecialCharacters}]`;
const uppercaseAlpha = `(?=${validCharacters}*[A-Z])`;
const lowercaseAlpha = `(?=${validCharacters}*[a-z])`;
const numeric = `(?=${validCharacters}*[0-9])`;
const specialCharacter = `(?=${validCharacters}*[${allowedSpecialCharacters}])`;
export const strongPassword = new RegExp(
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
