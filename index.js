const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

/**
 * Demonstrates a simple HTTP endpoint using API Gateway.
 */

//A dynamo DB table named quizzaws, with a question_id partition key and a difficulty sort key
//we retrieve one element
const params = {
  TableName: "quizzaws",
  Key: {
    question_id: "1",
    difficulty: "1",
  },
};

async function getItem() {
  try {
    const data = await dynamo.get(params).promise();
    return data;
  } catch (err) {
    return err;
  }
}

exports.handler = async (event, context) => {
  //console.log('Received event:', JSON.stringify(event, null, 2));

  let body;
  let statusCode = "200";
  const headers = {
    "Content-Type": "application/json",
  };
  try {
    switch (event.httpMethod) {
      case "GET":
        body = await getItem();
        console.log(body);
        break;

      default:
        throw new Error(`Unsupported method "${event.httpMethod}"`);
    }
  } catch (err) {
    statusCode = "400";
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
