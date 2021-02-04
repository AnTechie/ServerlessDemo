import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import { JsonWebTokenError } from 'jsonwebtoken'

const toDosTable = process.env.TODOS_TABLE
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  console.log(todoId);
  var params = {
    TableName:toDosTable,
    Key:{
        'todoId': todoId,
        'userId': 'chaitra'
    },
   
};
try {
  await docClient.delete(params).promise()
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
