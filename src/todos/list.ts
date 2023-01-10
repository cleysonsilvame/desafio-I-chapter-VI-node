"use strict";

import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { newDynamoDB } from "../utils/dynamodbClient";

export const list = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const { id: userId } = event.pathParameters;

    const dynamoDB = newDynamoDB();

    const { Items } = await dynamoDB
      .scan({
        TableName: "todos",
        FilterExpression: "user_id = :id",
        ExpressionAttributeValues: {
          ":id": userId,
        },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
