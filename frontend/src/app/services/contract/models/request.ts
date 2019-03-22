import {ToppingType} from './topping';

export const dataUrlRegExp = /^data:(.*?\/(.*?));(.*$)/;

export class ImageDataUrl {
  dataUrl: string;
}

export class CreateToppingBody {
  name: string;
  type: ToppingType;
  image: ImageDataUrl;
}

export class DeleteToppingPathParameters {
  toppingId: string;
}

export class UpdateToppingPathParameters {
  toppingId: string;
}

export class UpdateToppingBody {
  id: string;
  name: string;
  type: ToppingType;
  image: ImageDataUrl;
}
