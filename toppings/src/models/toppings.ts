import {ObjectId} from 'mongodb';

export interface Topping {
  id: ObjectId,
  name: string,
  image: {
    url: string;
  }
}