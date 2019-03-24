import 'reflect-metadata';
import {deserialize, plainToClass} from 'class-transformer';
import {validate} from 'class-validator';
import {ApiGatewayHandler, ApiGatewayUtil} from '@kalarrs/aws-util';
import {
  CreatePizzaBody,
  DeletePizzaPathParameters,
  UpdatePizzaBody,
  UpdatePizzaPathParameters,
  UploadPizzaImageBody
} from './models/request';
import {MongoClient} from 'mongodb';
import {MongoPizza} from './models/mongo-pizza';
import {mapMongoToppingToTopping} from '../../toppings/src/handler';
import AWS, {S3} from 'aws-sdk';
import {UploadToppingImageBody} from '../../toppings/src/models/request';

export const aws = AWS; // Used for mocking AWS in tests.

const {MONGO_URI, PIZZA_COLLECTION, PIZZAS_S3_BUCKET, PIZZA_TEMP_IMAGE_PREFIX} = process.env;
const s3 = new S3();
const apiGatewayUtil = new ApiGatewayUtil();
const mongoClientConnect = MongoClient.connect(MONGO_URI, {useNewUrlParser: true});

const mapMongoPizzaToPizza = ({_id, name, crust, size, toppings}: MongoPizza) => {
  return {
    id: _id,
    name,
    crust,
    size,
    toppings: toppings.map(mapMongoToppingToTopping)
  };
};

const updateImage = async ({image, name, ext}) => {
  await s3.copyObject({
    CopySource: `${PIZZAS_S3_BUCKET}/${PIZZA_TEMP_IMAGE_PREFIX}/${image.filename}`,
    Bucket: PIZZAS_S3_BUCKET,
    Key: `${name}.${ext}`,
    ACL: 'public-read'
  }).promise();
  await s3.deleteObject({
    Bucket: PIZZAS_S3_BUCKET,
    Key: `${PIZZA_TEMP_IMAGE_PREFIX}/${image.filename}`
  }).promise()
    .catch(e => null); // Ignore because bucket policy will always delete these images anyways.
};

export const createPizzaImageSingedUrl: ApiGatewayHandler = async (event) => {
  const body = deserialize(UploadPizzaImageBody, event.body);
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
  const {filename, contentType} = body;
  const signedUrl = s3.getSignedUrl('putObject', {
    Expires: 60,
    Bucket: PIZZAS_S3_BUCKET,
    Key: `${PIZZA_TEMP_IMAGE_PREFIX}/${filename}`, // upload with prefix. Allows easy setup for rule to remove after 5 min.
    ContentType: contentType,
    ACL: 'public-read'
  });

  return apiGatewayUtil.sendJson({statusCode: 201, body: {data: signedUrl}});
};

export const createPizza: ApiGatewayHandler = async (event) => {
  const client = await mongoClientConnect;
  const pizzaCollection = client.db().collection(PIZZA_COLLECTION);

  const body = deserialize(CreatePizzaBody, event.body);
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

  const {name, crust, size, toppings} = body;
  const existingTopping = await pizzaCollection.findOne({name});
  if (existingTopping) {
    const error = {
      type: 'Conflict',
      message: 'A topping with that name already exists.'
    };
    return apiGatewayUtil.sendJson({statusCode: 401, body: {error}});
  }

  const {ops} = await pizzaCollection.insertOne({
    name,
    crust,
    size,
    toppings
  });
  const [mongoPizza] = ops;
  const topping = mapMongoPizzaToPizza(mongoPizza);
  return apiGatewayUtil.sendJson({statusCode: 201, body: {data: topping}});
};

export const getPizzas: ApiGatewayHandler = async () => {
  const client = await mongoClientConnect;
  const pizzaCollection = client.db().collection(PIZZA_COLLECTION);

  const mongoPizzas = await pizzaCollection.find({}).toArray();
  return apiGatewayUtil.sendJson({body: {data: mongoPizzas.map(mapMongoPizzaToPizza)}});
};

export const deletePizza: ApiGatewayHandler = async (event) => {
  const client = await mongoClientConnect;
  const pizzaCollection = client.db().collection(PIZZA_COLLECTION);

  const {pizzaId} = plainToClass(DeletePizzaPathParameters, event.pathParameters);
  const {deletedCount} = await pizzaCollection.deleteOne({_id: pizzaId});

  return apiGatewayUtil.sendJson({statusCode: deletedCount === 0 ? 404 : 204});
};

export const updatePizza: ApiGatewayHandler = async (event) => {
  const client = await mongoClientConnect;
  const pizzaCollection = client.db().collection(PIZZA_COLLECTION);

  const {pizzaId} = plainToClass(UpdatePizzaPathParameters, event.pathParameters);
  const body = deserialize(UpdatePizzaBody, event.body);
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

  if (body.id.toString() !== pizzaId.toString()) {
    const error = {
      type: 'Validation',
      message: `Mismatch between the id in the path and the id in the body. Id is immutable values must be the same.`
    };
    return apiGatewayUtil.sendJson({statusCode: 400, body: {error}});
  }

  const {name, crust, size, toppings} = body;

  const {lastErrorObject, value} = await pizzaCollection.findOneAndUpdate({_id: pizzaId}, {
    $set: {
      name,
      crust,
      size,
      toppings
    }
  }, {upsert: true, returnOriginal: false});

  const topping = mapMongoPizzaToPizza(value);
  return apiGatewayUtil.sendJson({statusCode: lastErrorObject.updatedExisting ? 200 : 201, body: {data: topping}});
};
