import {IsDefined, IsEnum, Matches, MaxLength, MinLength, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';
import {ToppingType} from './toppings';
import {ObjectId} from 'mongodb';

export const dataUrlRegExp = /^data:(.*?\/(.*?));(.*$)/;

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

  @IsEnum(ToppingType, {
    message: ({property, constraints}) => {
      const [toppingTypeEnum] = constraints;
      const values = Object.values(toppingTypeEnum).join(', ');
      return `${property} must be a valid enum value: ${values}`;
    }
  })
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
