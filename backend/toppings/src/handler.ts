import 'reflect-metadata';
import {deserialize, plainToClass} from 'class-transformer';
import {validate} from 'class-validator';
import {ApiGatewayHandler, ApiGatewayUtil} from '@kalarrs/aws-util';
import {
  CreateToppingBody,
  dataUrlRegExp,
  DeleteToppingPathParameters,
  UpdateToppingBody,
  UpdateToppingPathParameters
} from './models/request';
import {MongoClient} from 'mongodb';
import {S3} from 'aws-sdk';
import {MongoTopping} from './models/mongo-topping';

const {MONGO_URI, TOPPING_COLLECTION, TOPPINGS_S3_BUCKET} = process.env;
const s3 = new S3();
const apiGatewayUtil = new ApiGatewayUtil();

export const mapMongoToppingToTopping = ({_id, type, image, name}: MongoTopping) => {
  return {
    id: _id,
    name,
    type,
    image: {url: s3.getSignedUrl('getObject', {Bucket: TOPPINGS_S3_BUCKET, Key: image.s3key})}
  };
};

const mongoClientConnect = MongoClient.connect(MONGO_URI, {useNewUrlParser: true});

export const createTopping: ApiGatewayHandler = async (event) => {
  const client = await mongoClientConnect;
  const toppingCollection = client.db().collection(TOPPING_COLLECTION);

  const body = deserialize(CreateToppingBody, event.body);
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

  const {name, type, image} = body;
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

  const {ops} = await toppingCollection.insertOne({
    name,
    type,
    image: {s3key: `${name}.${ext}`}
  });
  const [mongoTopping] = ops;
  const topping = mapMongoToppingToTopping(mongoTopping);
  return apiGatewayUtil.sendJson({statusCode: 201, body: {data: topping}});
};

export const getToppings: ApiGatewayHandler = async () => {
  const client = await mongoClientConnect;
  const toppingCollection = client.db().collection(TOPPING_COLLECTION);

  const mongoToppings = await toppingCollection.find({}).toArray();
  return apiGatewayUtil.sendJson({body: {data: mongoToppings.map(mapMongoToppingToTopping)}});
};

export const deleteTopping: ApiGatewayHandler = async (event) => {
  const client = await mongoClientConnect;
  const toppingCollection = client.db().collection(TOPPING_COLLECTION);

  const {toppingId} = plainToClass(DeleteToppingPathParameters, event.pathParameters);
  const {deletedCount} = await toppingCollection.deleteOne({_id: toppingId});

  return apiGatewayUtil.sendJson({statusCode: deletedCount === 0 ? 404 : 204});
};

export const updateTopping: ApiGatewayHandler = async (event) => {
  const client = await mongoClientConnect;
  const toppingCollection = client.db().collection(TOPPING_COLLECTION);

  const {toppingId} = plainToClass(UpdateToppingPathParameters, event.pathParameters);
  const body = deserialize(UpdateToppingBody, event.body);
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

  if (body.id.toString() !== toppingId.toString()) {
    const error = {
      type: 'Validation',
      message: `Mismatch between the id in the path and the id in the body. Id is immutable values must be the same.`
    };
    return apiGatewayUtil.sendJson({statusCode: 400, body: {error}});
  }

  const {name, type, image} = body;
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

  const {lastErrorObject, value} = await toppingCollection.findOneAndUpdate({_id: toppingId}, {
    $set: {
      name,
      type,
      image: {s3key: `${name}.${ext}`}
    }
  }, {upsert: true, returnOriginal: false});

  const topping = mapMongoToppingToTopping(value);
  return apiGatewayUtil.sendJson({statusCode: lastErrorObject.updatedExisting ? 200 : 201, body: {data: topping}});
};
