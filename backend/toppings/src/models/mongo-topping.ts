import {ObjectId} from 'mongodb';
import {ToppingType} from './topping';

export interface MongoTopping {
  _id?: ObjectId;
  name: string;
  type: ToppingType;
  image: {
    filename: string;
  }
}
