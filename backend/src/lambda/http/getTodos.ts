import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const toDosTable = process.env.TODOS_TABLE
const todoIndex = process.env.TodoIdIndex
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('Caller event', event)
  console.log(event.pathParameters.userId)
  const userId = event.pathParameters.userId

  const result =await getTodosByUser(userId);

  console.log(event);
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: result.Items
    })
  }
}

async function getTodosByUser(userId:string)
{
  return await docClient.query({
    TableName : toDosTable,
    IndexName : todoIndex,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
        ':userId': userId
    }
}).promise()
}
