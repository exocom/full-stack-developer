import {ObjectId} from 'mongodb';
import {ToppingType} from './topping';

export interface MongoToppingImage {
  filename: string;
}

export interface MongoTopping {
  _id?: ObjectId;
  name: string;
  type: ToppingType;
  image: MongoToppingImage
}
