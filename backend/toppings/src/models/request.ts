import {IsDefined, IsEnum, Matches, MaxLength, MinLength, ValidateNested, ValidationOptions} from 'class-validator';
import {Transform, Type} from 'class-transformer';
import {ToppingType} from './topping';
import {ObjectId} from 'mongodb';

export const dataUrlRegExp = /^data:(.*?\/(.*?));(.*$)/;

const enumCustomErrorMessage: ValidationOptions = {
  message: ({property, constraints}) => {
    const [toppingTypeEnum] = constraints;
    const values = Object.values(toppingTypeEnum).join(', ');
    return `${property} must be a valid enum value: ${values}`;
  }
};

export class ImageDataUrl {
  @IsDefined()
  @Matches(dataUrlRegExp)
  dataUrl: string;
}

export class CreateToppingBody {
  @IsDefined()
  @MinLength(3)
  @MaxLength(35)
  name: string;

  @IsEnum(ToppingType, enumCustomErrorMessage)
  type: ToppingType;

  @IsDefined()
  @ValidateNested()
  @Type(() => ImageDataUrl)
  image: ImageDataUrl;
}

export class DeleteToppingPathParameters {
  @Transform(value => ObjectId(value), {toClassOnly: true})
  toppingId: ObjectId;
}


export class UpdateToppingPathParameters {
  @Transform(value => ObjectId(value), {toClassOnly: true})
  toppingId: ObjectId;
}

export class UpdateToppingBody {
  @IsDefined()
  @Transform(value => ObjectId(value), {toClassOnly: true})
  id: ObjectId;

  @IsDefined()
  @MinLength(3)
  @MaxLength(35)
  name: string;

  @IsEnum(ToppingType, enumCustomErrorMessage)
  type: ToppingType;

  @IsDefined()
  @ValidateNested()
  @Type(() => ImageDataUrl)
  image: ImageDataUrl;
}
