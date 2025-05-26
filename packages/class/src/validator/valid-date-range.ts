import type { ValidationOptions } from 'class-validator';
import { ValidateBy, buildMessage, isDate } from 'class-validator';

export const VALID_DATE_RANGE = 'isValidDateRange';

export function isValidDateRange(value: unknown) {
  return Array.isArray(value) && value.every(it => isDate(new Date(it)));
}

export function IsValidDateRange(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: VALID_DATE_RANGE,
      validator: {
        validate: (value): boolean => isValidDateRange(value),
        defaultMessage: buildMessage(
          eachPrefix => `${eachPrefix} $property must be a valid date range`,
          validationOptions
        )
      }
    },
    validationOptions
  );
}
