import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { deleteTodo } from '../../businessLogic/todos'


const logger = createLogger('Create')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const authorization=event.headers.Authorization
  const split=authorization.split(' ')
  const jwtToken=split[1]
  
try {
  await deleteTodo(jwtToken,todoId)
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
