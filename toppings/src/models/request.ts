import {IsNotEmpty, Length, ValidateNested} from 'class-validator';

class ImageDataUrl {
  @IsNotEmpty()
  dataUrl: string;
}

export class CreateToppingRequest {
  @Length(3, 10)
  name: string;

  @ValidateNested()
  image: ImageDataUrl;
}
