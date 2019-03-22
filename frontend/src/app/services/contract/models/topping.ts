import {ObjectId} from 'bson';

export enum ToppingType {
  Cheese = 'cheese',
  Sauce = 'sauce',
  Vegetable = 'vegetable',
  Fruit = 'fruit',
  Meat = 'meat',
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
