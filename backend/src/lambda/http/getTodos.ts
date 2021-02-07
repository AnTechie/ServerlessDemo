import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllTodos } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'


const logger = createLogger('Create')
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
 
  logger.info("Get Todos Lambda")
  const authorization=event.headers.Authorization
  const split=authorization.split(' ')
  const jwtToken=split[1]
  const result=await getAllTodos(jwtToken)
 
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: result
    })
  }
}

