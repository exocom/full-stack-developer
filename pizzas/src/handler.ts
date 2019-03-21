import {AmazonConnectHandler, ScheduleEventHandler} from '@kalarrs/aws-util';
import {DynamoDBStreamHandler, S3Handler, SNSHandler, SQSHandler, CloudWatchLogsHandler, CognitoUserPoolTriggerHandler} from "aws-lambda";

// export const handler: AmazonConnectHandler = async (event, context) => {
// export const handler: DynamoDBStreamHandler = async (event, context) => {
// export const handler: S3Handler = async (event, context) => {
// export const handler: ScheduleEventHandler = async (event, context) => {
// export const handler: SNSHandler = async (event, context) => {
// export const handler: SQSHandler = async (event, context) => {
// export const handler: CloudWatchLogsHandler = async (event, context) => {
// export const handler: CognitoUserPoolTriggerHandler = async (event, context) => {

// };

/*
  API Gateway Simple Example:
 */
// import {ApiGatewayHandler, ApiGatewayUtil} from '@kalarrs/aws-util';
//
// const apiGatewayUtil = new ApiGatewayUtil();
//
// export const handler: ApiGatewayHandler = async (event) => {
//   const {queryStringParameters, pathParameters} = event;
//   const body = JSON.parse(event.body);
//
//   const data = {
//     queryStringParameters,
//     pathParameters,
//     body,
//     message: 'Thanks for using @kalarrs!'
//   };
//   return apiGatewayUtil.sendJson({body: {data}});
// };


/*
  API Gateway Complex Example:
  API Gateway data comes in on the request body, query string, and path parameters.

  Recommend:
    Use class-transformer to get values into a strongly typed class.
    yarn add class-transformer

    Use lambdaUtil.apiResponseJson for easy status code and body
    status code defaults to 200

  Optional:
    Use decorator based validation.
    yarn add class-validator
    NOTE: classes must be declared before they are used. Otherwise validator will fail on nested objects/classes.
*/

// import {deserialize, plainToClass} from 'class-transformer'; // Recommend
// import {validate} from 'class-validator';  // Optional
// import {ApiGatewayHandler, ApiGatewayUtil} from '@kalarrs/aws-util';
//
// const apiGatewayUtil = new ApiGatewayUtil();
//
// class QueryStringParameters {}
// class Body {}
// class PathParameters {}
//
// export const handler: ApiGatewayHandler = async (event) => {
//   const queryStringParameters = plainToClass(QueryStringParameters, event.queryStringParameters);
//   const body = deserialize(Body, event.body);
//   const pathParameters = plainToClass(PathParameters, event.pathParameters);
//
//   const queryErrors = await validate(queryStringParameters) || [];
//   const bodyErrors = await validate(body) || [];
//   const pathErrors = await validate(pathParameters) || [];
//
//   if (queryErrors.length || bodyErrors.length || pathErrors.length) {
//     const validation = [...queryErrors, ...bodyErrors, ...pathErrors];
//     const error = {
//       type: 'Validation',
//       message: 'Failed validation',
//       validation
//     };
//     return apiGatewayUtil.sendJson({statusCode: 400, body: {error}});
//   }
//
//   const buffer = new Buffer('Thanks for using @kalarrs!');
//   return apiGatewayUtil.sendBinary({body: buffer});
// };
