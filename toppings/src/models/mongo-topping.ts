import {ObjectId} from 'mongodb';

export interface MongoTopping {
  id: ObjectId,
  name: string,
  image: {
    s3key: string;
  }
}
