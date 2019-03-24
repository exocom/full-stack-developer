import {ToppingType} from './topping';
import {CrustType, PizzaSize} from './pizza';

export const dataUrlRegExp = /^data:(.*?\/(.*?));(.*$)/;

export class ImageRequest {
  filename: string;
}

export class CreateToppingBody {
  name: string;
  type: ToppingType;
  image: ImageRequest;
}

export class UpdateToppingBody {
  id: string;
  name: string;
  type: ToppingType;
  image: ImageRequest;
}

export class CreatePizzaBody {
  name: string;
  crust: CrustType;
  size: PizzaSize;
  price: number;
  image: ImageRequest;
  toppings: Array<void>;
}

export class UpdatePizzaBody {
  id: string;
  name: string;
  crust: CrustType;
  size: PizzaSize;
  price: number;
  image: ImageRequest;
  toppings: Array<void>;
}
