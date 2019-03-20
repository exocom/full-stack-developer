import {IsDefined, IsEnum, Matches, MaxLength, MinLength, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {ToppingType} from './toppings';

export const dataUrlRegExp = /^data:(.*?\/(.*?));(.*$)/;

export class ImageDataUrl {
  @IsDefined()
  @Matches(dataUrlRegExp)
  dataUrl: string;
}

export class CreateToppingRequest {
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
