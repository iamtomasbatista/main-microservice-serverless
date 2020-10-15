import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import middleware from '../lib/common.middleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

// 📝AWSLambda lambdas can only run for up to 15 minutes
async function createAuction(event, context) {      // 📝Serverless 'context' contains metadata about the execution of this lambda fn. 'event' contains all the data about the event that trigger this lambda fn.
  const { title } = event.body;     // 📝Middy we dont have to JSON.parse(event.body) coz httpJsonBodyParser middleware will do it before this lambda runs
  const now = new Date();

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    highestBid: {
      amount: 0      
    }
  }

  try {
    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction
    }).promise();
  } catch(error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  };

  return {
    statusCode: 201,
    body: JSON.stringify(auction)
  }
}

export const handler = middleware(createAuction);