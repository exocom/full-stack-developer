import {ObjectId} from 'bson';

export enum ToppingType {
  Sauce = 'sauce',
  Cheese = 'cheese',
  Meat = 'meat',
  Vegetable = 'vegetable',
  Fruit = 'fruit',
  Seasoning = 'seasoning'
}

export class Topping {
  id: string;
  name: string;
  type: ToppingType;
  image: {
    url: string;
  };
}
