import 'reflect-metadata';
import {deserialize, plainToClass} from 'class-transformer';
import {validate} from 'class-validator';
import {ApiGatewayHandler, ApiGatewayUtil} from '@kalarrs/aws-util';
import {CreatePizzaBody, DeletePizzaPathParameters, UpdatePizzaBody, UpdatePizzaPathParameters} from './models/request';
import {MongoClient} from 'mongodb';
import {MongoPizza} from './models/mongo-pizza';
import {mapMongoToppingToTopping} from '../../toppings/src/handler';

const {MONGO_URI, PIZZA_COLLECTION} = process.env;
const apiGatewayUtil = new ApiGatewayUtil();

const mapMongoPizzaToPizza = ({_id, name, crust, size, toppings}: MongoPizza) => {
  return {
    id: _id,
    name,
    crust,
    size,
    toppings: toppings.map(mapMongoToppingToTopping)
  };
};

export const createPizza: ApiGatewayHandler = async (event) => {
  const client = await MongoClient.connect(MONGO_URI, {useNewUrlParser: true});
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
  const client = await MongoClient.connect(MONGO_URI, {useNewUrlParser: true});
  const pizzaCollection = client.db().collection(PIZZA_COLLECTION);

  const mongoPizzas = await pizzaCollection.find({}).toArray();
  return apiGatewayUtil.sendJson({body: {data: mongoPizzas.map(mapMongoPizzaToPizza)}});
};

export const deletePizza: ApiGatewayHandler = async (event) => {
  const client = await MongoClient.connect(MONGO_URI, {useNewUrlParser: true});
  const pizzaCollection = client.db().collection(PIZZA_COLLECTION);

  const {pizzaId} = plainToClass(DeletePizzaPathParameters, event.pathParameters);
  const {deletedCount} = await pizzaCollection.deleteOne({_id: pizzaId});

  return apiGatewayUtil.sendJson({statusCode: deletedCount === 0 ? 404 : 204});
};

export const updatePizza: ApiGatewayHandler = async (event) => {
  const client = await MongoClient.connect(MONGO_URI, {useNewUrlParser: true});
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
