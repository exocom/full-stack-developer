import 'reflect-metadata';
import {deserialize, plainToClass} from 'class-transformer';
import {validate} from 'class-validator';
import {ApiGatewayHandler, ApiGatewayUtil} from '@kalarrs/aws-util';
import {
  CreateToppingBody,
  dataUrlRegExp,
  DeleteToppingPathParameters,
  DetectToppingBody,
  UpdateToppingBody,
  UpdateToppingPathParameters,
  UploadToppingImageBody
} from './models/request';
import {MongoClient} from 'mongodb';
import {Rekognition, S3} from 'aws-sdk';
import {MongoTopping} from './models/mongo-topping';
import {
  cheeseRegExp,
  meatRegExp,
  sauceRegExp,
  seasoningRegExp,
  ToppingBase,
  ToppingType,
  toppingTypeRegExp
} from './models/topping';

const {MONGO_URI, TOPPING_COLLECTION, TOPPINGS_S3_BUCKET, AWS_REGION} = process.env;
const s3 = new S3();
const rekognition = new Rekognition({region: AWS_REGION || 'us-west-2'});
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

export const createToppingImageSingedUrl: ApiGatewayHandler = async (event) => {
  const body = deserialize(UploadToppingImageBody, event.body);
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
    Bucket: TOPPINGS_S3_BUCKET,
    Key: `temp/${filename}`, // upload to temp, then setup rule on temp to remove after 5 min.
    ContentType: contentType,
    ACL: 'public-read'
  });

  return apiGatewayUtil.sendJson({statusCode: 201, body: {data: signedUrl}});
};

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
  const {value} = await toppingCollection.findOneAndDelete({_id: toppingId}, {projection: {image: 1}});
  if (value) {
    const {image} = value;
    await s3.deleteObject({Bucket: TOPPINGS_S3_BUCKET, Key: image.s3key}).promise();
  }
  return apiGatewayUtil.sendJson({statusCode: value ? 204 : 404});
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

export const detectTopping: ApiGatewayHandler = async (event) => {
  const body = deserialize(DetectToppingBody, event.body);
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

  const {dataUrl} = body;
  const matches = dataUrl.match(dataUrlRegExp);
  const [all, contentType, ext, base64data] = matches;

  try {
    const result = await rekognition.detectLabels({
      Image: {Bytes: Buffer.from(base64data, 'base64')}, MinConfidence: 65, MaxLabels: 15
    }).promise().catch(err => {
      console.log('ERROR', err);
    });

    if (!(result && result.Labels)) {
      return apiGatewayUtil.sendJson({statusCode: 404});
    }

    const shoe = result.Labels.find(l => l.Name === 'Shoe');
    if (shoe) {
      const toppingBase: ToppingBase = {
        name: 'Shoe',
        type: ToppingType.Seasoning
      };
      return apiGatewayUtil.sendJson({statusCode: 200, body: {data: toppingBase}});
    }

    const food = result.Labels.find(l => l.Name === 'Food');
    if (!food) {
      return apiGatewayUtil.sendJson({statusCode: 404});
    }
    const [bestGuess] = result.Labels.filter(l => l.Name !== 'Food' && !toppingTypeRegExp.test(l.Name) && l.Parents.find(l => l.Name === 'Food'));
    let type: ToppingType = null;
    for (const label of result.Labels) {
      if (toppingTypeRegExp.test(label.Name)) {
        type = label.Name as ToppingType;
        break;
      }
    }
    if (!type) { // Getting desperate!
      for (const label of result.Labels) {
        if (label.Parents) {
          const food = label.Parents.find(l => l.Name === 'Food');
          if (!food) {
            continue;
          }
        }
        if (cheeseRegExp.test(label.Name)) {
          type = ToppingType.Cheese;
          break;
        }
        if (sauceRegExp.test(label.Name)) {
          type = ToppingType.Sauce;
          break;
        }
        if (meatRegExp.test(label.Name)) {
          type = ToppingType.Meat;
          break;
        }
        if (seasoningRegExp.test(label.Name)) {
          type = ToppingType.Seasoning;
          break;
        }
      }
    }

    const toppingBase: ToppingBase = {
      name: bestGuess.Name,
      type
    };
    return apiGatewayUtil.sendJson({statusCode: 200, body: {data: toppingBase}});
  } catch (e) {
    const error = {
      type: 'Upload Failure',
      message: 'Unable to process the image.'
    };
    return apiGatewayUtil.sendJson({statusCode: 500, body: {error}});
  }
};
