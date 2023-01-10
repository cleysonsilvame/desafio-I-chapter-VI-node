import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import * as uuid from "uuid";

import { newDynamoDB } from "../utils/dynamodbClient";

interface TodoRequest {
  title: string;
  deadline: string;
}

export const create = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const { id: userId } = event.pathParameters;

    const dynamoDB = newDynamoDB();
    const data: TodoRequest = JSON.parse(event.body);

    const todo = {
      id: uuid.v4(),
      user_id: userId,
      title: data.title,
      done: false,
      deadline: new Date(data.deadline).toISOString(),
    };

    await dynamoDB
      .put({
        TableName: process.env.DYNAMODB_TABLE,
        Item: todo,
      })
      .promise();

    return {
      statusCode: 201,
      body: null,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
