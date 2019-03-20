const {describe} = require('mocha');
const {assert} = require('chai');
const {ObjectId} = require('mongodb');
const mongoUnit = require('mongo-unit');
const handler = require('../src/handler');


const testMongoUrl = process.env.MONGO_URL;
describe('service', () => {
  const testData = [/* 1 createdAt:3/19/2019, 6:40:43 PM*/
    {
      "_id": ObjectId("5c919a1b4678ee70a617858e"),
      "name": "sasuage",
      "image": {
        "s3key": "sasuage.gif"
      }
    },

    /* 2 createdAt:3/19/2019, 6:36:11 PM*/
    {
      "_id": ObjectId("5c91990bd24291707e38a906"),
      "name": "pineapple",
      "image": {
        "s3key": "pineapple.gif"
      }
    }];

  it('should be awesome', () => {
    return true;
  });
});
