require('reflect-metadata');
const {join} = require('path');
const {describe, it, before, beforeEach, after, afterEach} = require('mocha');
const {assert} = require('chai');
const {ObjectId} = require('mongodb');
const mongoUnit = require('mongo-unit');
const awsMock = require('aws-sdk-mock');
const {StandaloneLocalDevServer} = require('@kalarrs/serverless-local-dev-server/src/StandaloneLocalDevServer');

const serverlessLocalServer = new StandaloneLocalDevServer({
  projectPath: join(__dirname, '../'),
  configOverride: {plugins: []}
});

const signedUrlRegExp = ({bucket, key}) => {
  return new RegExp(`^https:\\/\\/${bucket}\.s3\.amazonaws\.com/${key}`)
};

const {dataUrlRegExp} = require('../src/models/request');

describe('toppings', () => {
  const testData = {
    toppings: [
      {
        _id: ObjectId('5c919a1b4678ee70a617858e'),
        name: 'sausage',
        image: {s3key: 'sausage.gif'}
      },
      {
        _id: ObjectId('5c91990bd24291707e38a906'),
        name: 'pineapple',
        image: {s3key: 'pineapple.gif'}
      }
    ]
  };

  before(async () => {
    const mongoUri = await mongoUnit.start();
    await serverlessLocalServer.loadServerlessYaml();
    process.env = {
      ...process.env,
      ...serverlessLocalServer.slsYaml.provider.environment,
      MONGO_URI: mongoUri,
    };
  });

  beforeEach(async () => {
    await mongoUnit.initDb(process.env.MONGO_URI, testData);
    awsMock.mock('S3', 'putObject', {ETag: '4166c51556fff0f1354b2f5704b1c297'});
  });

  after(async () => {
    await mongoUnit.stop();
    process.exit(0);
  });

  afterEach(async () => {
    await mongoUnit.drop();
    awsMock.restore('S3');
  });

  describe('create a topping', () => {
    const imageExt = 'png';
    const name = 'pepperoni';
    const requestBody = {
      name,
      image: {dataUrl: `data:image/${imageExt};base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=`}
    };

    it('should return a new topping', async () => {
      const {createTopping} = require('../src/handler');
      const {body, statusCode} = await createTopping({body: JSON.stringify(requestBody)});
      assert.equal(statusCode, 201);
      assert.isString(body);

      const {data} = JSON.parse(body);
      assert.equal(data.name, requestBody.name);
      assert.match(data.image.url, signedUrlRegExp({
        bucket: process.env.TOPPINGS_S3_BUCKET,
        key: `${name}\.${imageExt}`
      }));
    });
  });

  describe('create a topping with missing name', () => {
    const imageExt = 'png';
    const requestBody = {
      image: {dataUrl: `data:image/${imageExt};base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=`}
    };

    it('should return validation errors', async () => {
      const {createTopping} = require('../src/handler');
      const {body, statusCode} = await createTopping({body: JSON.stringify(requestBody)});
      assert.equal(statusCode, 400);
      assert.isString(body);

      const {error} = JSON.parse(body);
      assert.equal(error.type, 'Validation');
      assert.equal(error.message, 'Failed validation');
      assert.isArray(error.validation);

      const [nameError] = error.validation;
      const prop = 'name';
      assert.equal(nameError.property, prop);
      assert.equal(nameError.constraints.isDefined, `${prop} should not be null or undefined`);
      assert.equal(nameError.constraints.maxLength, `${prop} must be shorter than or equal to 35 characters`);
      assert.equal(nameError.constraints.minLength, `${prop} must be longer than or equal to 3 characters`);
    });
  });

  describe('create a topping with name that is too short', () => {
    const imageExt = 'png';
    const name = 'ta';
    const requestBody = {
      name,
      image: {dataUrl: `data:image/${imageExt};base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=`}
    };

    it('should return validation errors', async () => {
      const {createTopping} = require('../src/handler');
      const {body, statusCode} = await createTopping({body: JSON.stringify(requestBody)});
      assert.equal(statusCode, 400);
      assert.isString(body);

      const {error} = JSON.parse(body);
      assert.equal(error.type, 'Validation');
      assert.equal(error.message, 'Failed validation');
      assert.isArray(error.validation);

      const [nameError] = error.validation;
      const prop = 'name';
      assert.equal(nameError.property, prop);
      assert.isUndefined(nameError.constraints.isDefined);
      assert.isUndefined(nameError.constraints.maxLength);
      assert.equal(nameError.constraints.minLength, `${prop} must be longer than or equal to 3 characters`);
    });
  });

  describe('create a topping with name that is too long', () => {
    const imageExt = 'png';
    const name = 'pepppppppppppppoooorrrrrnnnniiiiiiii';
    const requestBody = {
      name,
      image: {dataUrl: `data:image/${imageExt};base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=`}
    };

    it('should return validation errors', async () => {
      const {createTopping} = require('../src/handler');
      const {body, statusCode} = await createTopping({body: JSON.stringify(requestBody)});
      assert.equal(statusCode, 400);
      assert.isString(body);

      const {error} = JSON.parse(body);
      assert.equal(error.type, 'Validation');
      assert.equal(error.message, 'Failed validation');
      assert.isArray(error.validation);

      const [nameError] = error.validation;
      const prop = 'name';
      assert.equal(nameError.property, prop);
      assert.isUndefined(nameError.constraints.isDefined);
      assert.equal(nameError.constraints.maxLength, `${prop} must be shorter than or equal to 35 characters`);
      assert.isUndefined(nameError.constraints.minLength);
    });
  });

  describe('create a topping with missing image', () => {
    const name = 'pepperoni';
    const requestBody = {
      name
    };

    it('should return validation errors', async () => {
      const {createTopping} = require('../src/handler');
      const {body, statusCode} = await createTopping({body: JSON.stringify(requestBody)});
      assert.equal(statusCode, 400);
      assert.isString(body);

      const {error} = JSON.parse(body);
      assert.equal(error.type, 'Validation');
      assert.equal(error.message, 'Failed validation');
      assert.isArray(error.validation);

      const [imageError] = error.validation;
      const prop = 'image';
      assert.equal(imageError.property, prop);
      assert.equal(imageError.constraints.isDefined, `${prop} should not be null or undefined`);
    });
  });

  describe('create a topping with image that has no dataUrl', () => {
    const name = 'pepperoni';
    const requestBody = {
      name,
      image: {}
    };

    it('should return validation errors', async () => {
      const {createTopping} = require('../src/handler');
      const {body, statusCode} = await createTopping({body: JSON.stringify(requestBody)});
      assert.equal(statusCode, 400);
      assert.isString(body);

      const {error} = JSON.parse(body);
      assert.equal(error.type, 'Validation');
      assert.equal(error.message, 'Failed validation');
      assert.isArray(error.validation);

      const [imageError] = error.validation;
      assert.isArray(imageError.children);

      const [imageDataError] = imageError.children;
      const prop = 'dataUrl';
      assert.equal(imageDataError.property, prop);
      assert.equal(imageDataError.constraints.isDefined, `${prop} should not be null or undefined`);
      assert.equal(imageDataError.constraints.matches, `${prop} must match ${dataUrlRegExp} regular expression`);

    });
  });

  describe('create a topping with invalid image dataUrl', () => {
    const name = 'pepperoni';
    const requestBody = {
      name,
      image: {dataUrl: 'foo'}
    };

    it('should return validation errors', async () => {
      const {createTopping} = require('../src/handler');
      const {body, statusCode} = await createTopping({body: JSON.stringify(requestBody)});
      assert.equal(statusCode, 400);
      assert.isString(body);

      const {error} = JSON.parse(body);
      assert.equal(error.type, 'Validation');
      assert.equal(error.message, 'Failed validation');
      assert.isArray(error.validation);

      const [imageError] = error.validation;
      assert.isArray(imageError.children);

      const [imageDataError] = imageError.children;
      const prop = 'dataUrl';
      assert.equal(imageDataError.property, prop);
      assert.isUndefined(imageDataError.constraints.isDefined);
      assert.equal(imageDataError.constraints.matches, `${prop} must match ${dataUrlRegExp} regular expression`);
    });
  });


  describe('create a topping with the same name as an existing topping', () => {
    const imageExt = 'png';
    const name = 'sausage';
    const requestBody = {
      name,
      image: {dataUrl: `data:image/${imageExt};base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=`}
    };

    it('should return a new topping', async () => {
      const {createTopping} = require('../src/handler');
      const {body, statusCode} = await createTopping({body: JSON.stringify(requestBody)});
      assert.equal(statusCode, 401);
      assert.isString(body);

      const {error} = JSON.parse(body);
      assert.equal(error.type, 'Conflict');
      assert.equal(error.message, 'A topping with that name already exists.');
    });
  });

  // NOTE: Something with the s3 mock is not working when this is run with other tests. Works when run alone.
  describe.skip('create a topping, but then fails to save image to s3', () => {
    const imageExt = 'png';
    const name = 'ham';
    const requestBody = {
      name,
      image: {dataUrl: `data:image/${imageExt};base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=`}
    };

    beforeEach(async () => {
      await awsMock.restore('S3');
      await awsMock.mock('S3', 'putObject', (param, cb) => {
        cb(new Error('failed for some reason!'))
      });
    });

    it('should return a server error', async () => {
      const {createTopping} = require('../src/handler');
      const {body} = await createTopping({body: JSON.stringify(requestBody)});
      assert.isString(body);

      const {error} = JSON.parse(body);
      assert.equal(error.type, 'Upload Failure');
      assert.equal(error.message, 'Unable to save the image.');
    });
  });
});
