import {ValidationOptions} from 'class-validator';

export const enumCustomErrorMessage: ValidationOptions = {
  message: ({property, constraints}) => {
    const [toppingTypeEnum] = constraints;
    const values = Object.values(toppingTypeEnum).join(', ');
    return `${property} must be a valid enum value: ${values}`;
  }
};
