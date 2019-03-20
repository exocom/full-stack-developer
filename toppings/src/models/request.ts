import {IsDefined, Matches, MaxLength, MinLength, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';

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

  @IsDefined()
  @ValidateNested()
  @Type(() => ImageDataUrl)
  image: ImageDataUrl;
}
