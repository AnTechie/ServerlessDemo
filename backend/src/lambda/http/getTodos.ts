import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../../lambda/utils'
import * as AWSXRAY from 'aws-xray-sdk'

const toDosTable = process.env.TODOS_TABLE
const todoIndex = process.env.TodoIdIndex
const XAWS = AWSXRAY.captureAWS(AWS);

const docClient = new XAWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('Caller event', event)
  console.log(event.pathParameters.userId)
  //const userId = event.pathParameters.userId
  const userId=getUserId(event)

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
