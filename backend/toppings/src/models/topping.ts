import {ObjectId} from 'mongodb';

export enum ToppingType {
  Cheese = 'cheese',
  Sauce = 'sauce',
  Vegetable = 'vegetable',
  Fruit = 'fruit',
  Meat = 'meat',
  Seasoning = 'seasoning'
}

export const toppingTypeRegExp = new RegExp(`^(${Object.keys(ToppingType).join('|')})$`, 'gi');
export const cheeseRegExp = /(Pasta)/gi;
export const sauceRegExp = /(Ketchup)/gi;
export const meatRegExp = /(Meat|Chicken|Confectionery|Nuggets)/gi;
export const seasoningRegExp = /(Mineral|Sugar|Crystal)/gi;

export interface ToppingBase {
  name: string;
  type: ToppingType;
}

export interface Topping extends ToppingBase {
  id: ObjectId;
  image: {
    url: string;
  };
}
