import {ObjectId} from 'mongodb';

export enum ToppingType {
  Cheese = 'cheese',
  Sauce = 'sauce',
  Vegetable = 'vegetable',
  Fruit = 'fruit',
  Meat = 'meat',
  Seasoning = 'seasoning'
}

export interface Topping {
  id: ObjectId;
  name: string;
  type: ToppingType;
  image: {
    url: string;
  }
}
