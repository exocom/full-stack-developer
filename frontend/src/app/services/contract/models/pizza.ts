import {Topping} from './topping';

export enum CrustType {
  Regular = 'regular',
  Thin = 'thin',
  Stuffed = 'stuffed',
  GlutenFree = 'gluten-free'
}

export enum PizzaSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  XLarge = 'x-large'
}

export class Pizza {
  id: string;
  name: string;
  crust: CrustType;
  size: PizzaSize;
  price: number;
  image: {
    filename: string;
    url: string;
  };
  toppings: Array<Topping>;
}


export class Defaults {
  static pizza: Pizza = {
    id: null,
    name: null,
    crust: null,
    size: null,
    price: null,
    image: {
      filename: null,
      url: null
    },
    toppings: []
  };
}
