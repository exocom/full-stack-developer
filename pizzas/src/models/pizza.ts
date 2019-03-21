import {ObjectId} from 'mongodb';
import {Topping} from '../../../toppings/src/models/topping';

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

export interface Pizza {
  id: ObjectId;
  name: string;
  crust: CrustType;
  size: PizzaSize;
  toppings: Array<Topping>
}
