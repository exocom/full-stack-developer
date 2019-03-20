const {join} = require('path');
const {describe, it, before, beforeEach, afterEach} = require('mocha');
const {assert} = require('chai');
const {ObjectId} = require('mongodb');
const mongoUnit = require('mongo-unit');
const awsMock = require('aws-sdk-mock');
const {StandaloneLocalDevServer} = require('@kalarrs/serverless-local-dev-server/src/StandaloneLocalDevServer');

const serverlessLocalServer = new StandaloneLocalDevServer({
  projectPath: join(__dirname, '../'),
  configOverride: {plugins: []}
});

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
    awsMock.mock('S3', 'listObjects', (a, b) => {
      console.log(a, b);
      return {Contents: [{Key: 'foo.wav'}]};
    });
    awsMock.mock('S3', 'getSignedUrl', (operation, params) => `https://${params.Bucket}.s3.us-west-2.amazonaws.com/${params.Key}`);
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
      image: {"dataUrl": `data:image/${imageExt};base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=`}
    };

    it('should return a new topping', async () => {
      const {createTopping} = require('../src/handler');
      const {body} = await createTopping({body: JSON.stringify(requestBody)});
      assert.isString(body);

      const {data} = JSON.parse(body);
      assert.equal(requestBody.name, data.name);
      assert.equal(`https://${process.env.TOPPINGS_S3_BUCKET}.s3.us-west-2.amazonaws.com/${name}.${imageExt}`, await data.image.url);
    });
  });

  describe('create a topping with missing name', () => {
    it('should return validation errors', () => {
      return true;
    });
  });

  describe('create a topping with missing image', () => {
    it('should return validation errors', () => {
      return true;
    });
  });

  describe('create a topping with invalid image dataUrl', () => {
    it('should return validation errors with a info about dataUrl format', () => {
      return true;
    });
  });

  describe('create a topping with the same name as an existing topping', () => {
    it('should return a validation error', () => {
      return true;
    });
  });

  describe('create a topping, but then fails to save image to s3', () => {
    it('should return a server error', () => {
      return true;
    });
  });
});
