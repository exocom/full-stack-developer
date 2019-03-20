import {IsDefined, IsNotEmpty, MaxLength, MinLength, ValidateNested} from 'class-validator';

class ImageDataUrl {
  @IsNotEmpty()
  dataUrl: string;
}

export class CreateToppingRequest {
  @IsDefined()
  @MinLength(3)
  @MaxLength(35)
  name: string;

  @ValidateNested()
  image: ImageDataUrl;
}
