import {ObjectId} from 'mongodb';
import {CrustType, PizzaSize} from './pizza';
import {MongoTopping} from '../../../toppings/src/models/mongo-topping';

export interface MongoPizza {
  _id: ObjectId;
  name: string;
  crust: CrustType;
  size: PizzaSize;
  price: number;
  toppings: Array<MongoTopping>;
}
