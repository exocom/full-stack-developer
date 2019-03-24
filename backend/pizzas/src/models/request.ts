import {IsDefined, IsEnum, Matches, MaxLength, MinLength, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';
import {CrustType, PizzaSize} from './pizza';
import {ObjectId} from 'mongodb';
import {enumCustomErrorMessage} from '../../../common/src/validation';
import {imageFileNameRegExp, ImageMimeTypes} from '../../../common/src/image';
import {ToppingImageRequest} from '../../../toppings/src/models/request';

export class PizzaImageRequest {
  @IsDefined()
  @Matches(imageFileNameRegExp)
  filename: string;
}

export class UploadPizzaImageBody {
  @Matches(imageFileNameRegExp)
  filename: string;

  @IsEnum(ImageMimeTypes, enumCustomErrorMessage)
  contentType: ImageMimeTypes;
}

export class CreatePizzaBody {
  @IsDefined()
  @MinLength(3)
  @MaxLength(35)
  name: string;

  @IsEnum(CrustType, enumCustomErrorMessage)
  crust: CrustType;

  @IsEnum(PizzaSize, enumCustomErrorMessage)
  size: PizzaSize;

  @IsDefined()
  price: number;

  @IsDefined()
  @ValidateNested()
  @Type(() => ToppingImageRequest)
  image: ToppingImageRequest;
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

  @IsDefined()
  price: number;

  @IsDefined()
  @ValidateNested()
  @Type(() => ToppingImageRequest)
  image: ToppingImageRequest;
}
