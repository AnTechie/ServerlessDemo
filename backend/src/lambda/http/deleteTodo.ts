import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../../lambda/utils'
import { createLogger } from '../../utils/logger'

const toDosTable = process.env.TODOS_TABLE
const docClient = new AWS.DynamoDB.DocumentClient()
const logger = createLogger('Create')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  console.log(todoId);
  var params = {
    TableName:toDosTable,
    Key:{
        'todoId': todoId,
        'userId': getUserId(event)
    },
   
};
try {
  await docClient.delete(params).promise()
  logger.info("todo deleted ${todoId}")
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body:""
  }
}
catch(e)
{
 console.log(e)
 return {
  statusCode: 201,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  body:JSON.stringify({
    "todoId": todoId,
    "message":"Error"
  })
}
}

 
}
