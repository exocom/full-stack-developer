import {ObjectId} from 'mongodb';

export interface MongoTopping {
  _id: ObjectId,
  name: string,
  image: {
    s3key: string;
  }
}
