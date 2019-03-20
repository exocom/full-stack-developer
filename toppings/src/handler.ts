import {deserialize, plainToClass} from 'class-transformer';
import {validate} from 'class-validator';
import {ApiGatewayHandler, ApiGatewayUtil} from '@kalarrs/aws-util';
import {CreateToppingRequest, dataUrlRegExp, ImageDataUrl} from './models/request';
import {MongoClient} from 'mongodb';
import {S3} from 'aws-sdk';
import {MongoTopping} from './models/mongo-topping';

const {MONGO_URI, TOPPING_COLLECTION, TOPPINGS_S3_BUCKET} = process.env;
const s3 = new S3();
const apiGatewayUtil = new ApiGatewayUtil();


const mapMongoToppingToTopping = ({_id, image, name}: MongoTopping) => {
  return {
    id: _id,
    image: {url: s3.getSignedUrl('getObject', {Bucket: TOPPINGS_S3_BUCKET, Key: image.s3key})},
    name
  };
};

export const createTopping: ApiGatewayHandler = async (event) => {
  const client = await MongoClient.connect(MONGO_URI, {useNewUrlParser: true});
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
  const existingTopping = await toppingCollection.findOne({name});
  if (existingTopping) {
    const error = {
      type: 'Conflict',
      message: 'A topping with that name already exists.'
    };
    return apiGatewayUtil.sendJson({statusCode: 401, body: {error}});
  }

  const matches = image.dataUrl.match(dataUrlRegExp);
  const [dataUrl, contentType, ext, base64data] = matches;
  try {
    await s3.putObject({
      Bucket: TOPPINGS_S3_BUCKET,
      Key: `${name}.${ext}`,
      ContentType: contentType,
      Body: Buffer.from(base64data, 'base64')
    }).promise();
  } catch (e) {
    const error = {
      type: 'Upload Failure',
      message: 'Unable to save the image.'
    };
    return apiGatewayUtil.sendJson({statusCode: 500, body: {error}});
  }

  const results = await toppingCollection.insertOne({
    name,
    image: {s3key: `${name}.${ext}`}
  });
  const [mongoTopping] = results.ops;
  const topping = mapMongoToppingToTopping(mongoTopping);
  return apiGatewayUtil.sendJson({statusCode: 201, body: {data: topping}});
};
