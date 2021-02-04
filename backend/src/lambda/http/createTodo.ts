import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as uuid from 'uuid'

//import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
const toDosTable = process.env.TODOS_TABLE
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  //return undefined
console.log(event);
  const parsedBody = JSON.parse(event.body)
  const itemId = uuid.v4()
  const timestamp = new Date().toISOString()
  const newItem = {
    userId: 'chaitra',
    todoId: itemId,
    createdAt: timestamp,
    ...parsedBody,
  }

  console.log(newItem);

  await docClient.put({
    TableName: toDosTable,
    Item: newItem
  }).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem
    })
  }
}
