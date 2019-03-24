export enum ToppingType {
  Sauce = 'sauce',
  Cheese = 'cheese',
  Meat = 'meat',
  Vegetable = 'vegetable',
  Fruit = 'fruit',
  Seasoning = 'seasoning'
}

export class ToppingBase {
  name: string;
  type?: ToppingType;
}

export class Topping extends ToppingBase {
  id: string;
  image: {
    filename: string;
    url: string;
  };
}

export class Defaults {
  static topping: Topping = {
    id: null,
    name: null,
    type: null,
    image: {
      filename: null,
      url: null
    }
  };
}
