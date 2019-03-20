import {deserialize, plainToClass} from 'class-transformer';
import {validate} from 'class-validator';
import {ApiGatewayHandler, ApiGatewayUtil} from '@kalarrs/aws-util';
import {CreateToppingRequest} from './models/request';
import {MongoClient} from 'mongodb';
import {S3} from 'aws-sdk';
import {MongoTopping} from './models/mongo-topping';

const {MONGO_URI, TOPPING_COLLECTION, TOPPINGS_S3_BUCKET} = process.env;
const s3 = new S3();
const apiGatewayUtil = new ApiGatewayUtil();


const mapMongoToppingToTopping = ({id, image, name}: MongoTopping) => {
  return {
    id,
    image: {url: s3.getSignedUrl('getObject', {Bucket: TOPPINGS_S3_BUCKET, key: image.s3key})},
    name
  };
};

export const createTopping: ApiGatewayHandler = async (event) => {
  const mongoConnect = MongoClient.connect(MONGO_URI, {useNewUrlParser: true});
  const client: MongoClient = await mongoConnect;
  const toppingCollection = client.db().collection(TOPPING_COLLECTION);

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

  const {name, image} = body;

  // Save image to s3 bucket.
  const matches = image.dataUrl.match(/^data:(.*?\/(.*?));(.*$)/);
  if (!matches) {
    const error = {
      type: 'Validation',
      message: 'Failed validation',
      validation: ['Invalid image type.']
    };
    return apiGatewayUtil.sendJson({statusCode: 400, body: {error}});
  }

  const [dataUrl, contentType, base64data, ext] = matches;
  const result = await s3.putObject({
    Bucket: TOPPINGS_S3_BUCKET,
    Key: `${name}.${ext}`,
    ContentType: contentType,
    ACL: 'public-read',
    Body: Buffer.from(base64data, 'base64')
  }).promise();

  if (!result) {
    const error = {
      type: 'Upload Failure',
      message: 'Unable to save the image'
    };
    return apiGatewayUtil.sendJson({statusCode: 500, body: {error}});
  }

  const mongoTopping = await toppingCollection.insertOne({
    name,
    image: {s3key: `${name}.${ext}`}
  });
  const topping = mapMongoToppingToTopping(mongoTopping);
  return apiGatewayUtil.sendJson({body: {data: topping}});
};
