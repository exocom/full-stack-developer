import {Topping} from '../models/topping';

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

  toppings: Array<Topping>;
}
