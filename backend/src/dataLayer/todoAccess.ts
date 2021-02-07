import * as AWS  from 'aws-sdk'
import * as AWSXRAY from 'aws-xray-sdk'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'


const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const logger = createLogger('Create')
const XAWS= AWSXRAY.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })
export class TodoAccess{
    private readonly toDosTable = process.env.TODOS_TABLE
    private readonly docClient = new XAWS.DynamoDB.DocumentClient()
    private readonly todoIndex = process.env.TodoIdIndex

    async getAllTodos(userId:string):Promise<TodoItem[]>
    {
        logger.info("getAllTodos before dynamodb query start")

        const toDos= await this.docClient.query({
            TableName : this.toDosTable,
            IndexName : this.todoIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        logger.info("getAllTodos before dynamodb query completed")

        const items=toDos.Items 
        return items as TodoItem[]
    }

    async createTodo(todoItem:TodoItem):Promise<TodoItem>
    {
        logger.info("Entered Create Todo DAO")

        await this.docClient.put({
            TableName: this.toDosTable,
            Item: todoItem
          }).promise()
        
        return todoItem
    }

    async deleteTodo(userId:string,todoId:string):Promise<void>
    {
        logger.info("deleteTodo dal")

        var params = {
            TableName:this.toDosTable,
            Key:{
                'todoId': todoId,
                'userId': userId
            },
        
        };
      await this.docClient.delete(params).promise()
  
    }
    async updateTodo(updatedTodo:UpdateTodoRequest,userId:string,todoId:string):Promise<UpdateTodoRequest>
    {
        logger.info("update dal")

        var params = {
            TableName:this.toDosTable,
            Key:{
                'todoId': todoId,
                'userId': userId
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
     await this.docClient.update(params).promise()
     return updatedTodo
    }

     async  getUploadUrl(imageId: string):Promise<string> {
        logger.info("getUploadUrl dal")

        return s3.getSignedUrl('putObject', {
          Bucket: bucketName,
          Key: imageId,
          Expires: urlExpiration
        })
      }
}
