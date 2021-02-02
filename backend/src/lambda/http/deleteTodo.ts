import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import { JsonWebTokenError } from 'jsonwebtoken'

const toDosTable = process.env.TODOS_TABLE
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  
  var params = {
    TableName:toDosTable,
    Key:{
        "todoId": todoId,
        "userId": "chaitra"
    },
   
};
await docClient.delete(params).promise()
  // TODO: Remove a TODO item by id
  //return undefined
  console.log(event);
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body:JSON.stringify({
      "todoId": todoId,
      "message":"Deleted"
    })
  }
}
