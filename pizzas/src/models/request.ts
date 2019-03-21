import {IsDefined, IsEnum, MaxLength, MinLength, ValidateNested, ValidationOptions} from 'class-validator';
import {Transform} from 'class-transformer';
import {ObjectId} from 'mongodb';
import {CrustType, PizzaSize} from './pizza';
import {UpdateToppingBody} from '../../../toppings/src/models/request';

const enumCustomErrorMessage: ValidationOptions = {
  message: ({property, constraints}) => {
    const [toppingTypeEnum] = constraints;
    const values = Object.values(toppingTypeEnum).join(', ');
    return `${property} must be a valid enum value: ${values}`;
  }
};

export class CreatePizzaBody {
  @IsDefined()
  @MinLength(3)
  @MaxLength(35)
  name: string;

  @IsEnum(CrustType, enumCustomErrorMessage)
  crust: CrustType;

  @IsEnum(PizzaSize, enumCustomErrorMessage)
  size: PizzaSize;

  @ValidateNested()
  toppings: Array<UpdateToppingBody>;
}

export class DeletePizzaPathParameters {
  @Transform(value => ObjectId(value), {toClassOnly: true})
  pizzaId: ObjectId;
}


export class UpdatePizzaPathParameters {
  @Transform(value => ObjectId(value), {toClassOnly: true})
  pizzaId: ObjectId;
}

export class UpdatePizzaBody {
  @IsDefined()
  @Transform(value => ObjectId(value), {toClassOnly: true})
  id: ObjectId;

  @IsDefined()
  @MinLength(3)
  @MaxLength(35)
  name: string;

  @IsEnum(CrustType, enumCustomErrorMessage)
  crust: CrustType;

  @IsEnum(PizzaSize, enumCustomErrorMessage)
  size: PizzaSize;

  @ValidateNested()
  toppings: Array<UpdateToppingBody>;
}
