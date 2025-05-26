import type { ValidationOptions } from 'class-validator';
import { ValidateBy, buildMessage, isDate } from 'class-validator';

export const VALID_DATE = 'isValidDate';

export function isValidDate(value: any) {
  return isDate(new Date(value));
}

export function IsValidDate(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: VALID_DATE,
      validator: {
        validate: (value): boolean => isValidDate(value),
        defaultMessage: buildMessage(eachPrefix => `${eachPrefix} $property must be a valid date`, validationOptions)
      }
    },
    validationOptions
  );
}
