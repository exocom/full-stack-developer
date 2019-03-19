import {deserialize, plainToClass} from 'class-transformer';
import {validate} from 'class-validator';
import {ApiGatewayHandler, ApiGatewayUtil} from '@kalarrs/aws-util';
import {CreateToppingRequest} from './models/request';
import {MongoClient} from 'mongodb';
import {S3} from 'aws-sdk';

const {MONGO_URI, TOPPINGS_S3_BUCKET} = process.env;
const s3 = new S3();
const apiGatewayUtil = new ApiGatewayUtil();


export const createTopping: ApiGatewayHandler = async (event) => {
  const mongoConnect = MongoClient.connect(MONGO_URI, {useNewUrlParser: true});
  const client: MongoClient = await mongoConnect;

  const toppingColletion = client.db().collection(process.env.TOPPING_COLLECTION);

  const body = deserialize(CreateToppingRequest, event.body);

  const bodyErrors = await validate(body) || [];

  if (bodyErrors.length) {
    const validation = [...bodyErrors];
    const error = {
      type: 'Validation',
      message: 'Failed validation',
      validation
    };
    return apiGatewayUtil.sendJson({statusCode: 400, body: {error}});
  }

  const topping = {};

  return apiGatewayUtil.sendJson({body: {data: topping}});
};
