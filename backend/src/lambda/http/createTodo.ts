import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as uuid from 'uuid'
import { getUserId } from '../../lambda/utils'
import { createLogger } from '../../utils/logger'


//import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
const toDosTable = process.env.TODOS_TABLE
const docClient = new AWS.DynamoDB.DocumentClient()
const logger = createLogger('Create')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
  const parsedBody = JSON.parse(event.body)
  const itemId = uuid.v4()
  const timestamp = new Date().toISOString()
  const newItem = {
    userId: getUserId(event),
    todoId: itemId,
    createdAt: timestamp,
    ...parsedBody,
  }

  await docClient.put({
    TableName: toDosTable,
    Item: newItem
  }).promise()

  logger.info("Todo Created")

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
