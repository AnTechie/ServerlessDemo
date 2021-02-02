import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const toDosTable = process.env.TODOS_TABLE
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  
  const params = {
    TableName: toDosTable,
    Key: {
      userId: 'chaitra',
      todoId: todoId
    },
    ExpressionAttributeNames: {
      '#todo_name': 'name',
    },
    ExpressionAttributeValues: {
      ':name': updatedTodo.name,
      ':dueDate': updatedTodo.dueDate,
      ':done': updatedTodo.done,
    },
    UpdateExpression: 'SET #todo_name = :name, dueDate = :dueDate, done = :done',
    ReturnValues: 'ALL_NEW',
  };

  await docClient.update(params).promise();

  console.log(event);
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body:JSON.stringify(updatedTodo)
  }
}
