const {describe, it} = require('mocha');
const {assert} = require('chai');
const {ObjectId} = require('mongodb');
const mongoUnit = require('mongo-unit');
const handler = require('../src/handler');

// aws-sdk-mock

const testMongoUrl = process.env.MONGO_URL;
describe('toppings', () => {
  const testData = [
    {
      _id: ObjectId('5c919a1b4678ee70a617858e'),
      name: 'sausage',
      image: {
        s3key: 'sausage.gif'
      }
    },
    {
      _id: ObjectId('5c91990bd24291707e38a906'),
      name: 'pineapple',
      image: {
        s3key: 'pineapple.gif'
      }
    }];

  describe('create a topping', () => {
    it('should return a new topping', () => {
      return true;
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
