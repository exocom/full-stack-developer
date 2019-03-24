import {IsDefined, IsEnum, Matches, MaxLength, MinLength, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';
import {ToppingType} from './topping';
import {ObjectId} from 'mongodb';
import {enumCustomErrorMessage} from '../../../common/src/validation';
import {imageFileNameRegExp, ImageMimeTypes} from '../../../common/src/image';

export class ToppingImageRequest {
  @IsDefined()
  @Matches(imageFileNameRegExp)
  filename: string;
}

export class UploadToppingImageBody {
  @Matches(imageFileNameRegExp)
  filename: string;

  @IsEnum(ImageMimeTypes, enumCustomErrorMessage)
  contentType: ImageMimeTypes;
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
  @Type(() => ToppingImageRequest)
  image: ToppingImageRequest;
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
  @Type(() => ToppingImageRequest)
  image: ToppingImageRequest;
}

export class DetectToppingBody {
  @IsDefined()
  @Matches(imageFileNameRegExp)
  filename: string;
}
