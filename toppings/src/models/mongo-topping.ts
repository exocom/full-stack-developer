import {ObjectId} from 'mongodb';
import {ToppingType} from './toppings';

export interface MongoTopping {
  _id: ObjectId;
  name: string;
  type: ToppingType;
  image: {
    s3key: string;
  }
}
